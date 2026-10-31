import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MembershipStatus, Role } from '../generated/prisma/client.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import {
  DuplicateMemberError,
  MemberChanges,
  MemberRepository,
} from './member.repository.js';

export type MemberView = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'expired';
  joinedAt: string;
  membershipStartsAt: string | null;
  membershipEndsAt: string | null;
};

type MemberRecord = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  status: MembershipStatus;
  joinedAt: Date;
  membershipStartsAt: Date | null;
  membershipEndsAt: Date | null;
};

const managementRoles: Role[] = ['PRESIDENT', 'ADMINISTRATOR'];
const readAllRoles: Role[] = [...managementRoles, 'TREASURER'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const statusLabels: Record<MembershipStatus, MemberView['status']> = {
  ACTIVE: 'active',
  PENDING: 'pending',
  EXPIRED: 'expired',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseDate(value: unknown, fieldName: string): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException(`${fieldName} must be a date in YYYY-MM-DD format.`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (date.toISOString().slice(0, 10) !== value) {
    throw new BadRequestException(`${fieldName} is not a valid calendar date.`);
  }
  return date;
}

function toMemberView(member: MemberRecord): MemberView {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    status: statusLabels[member.status],
    joinedAt: member.joinedAt.toISOString(),
    membershipStartsAt: member.membershipStartsAt?.toISOString().slice(0, 10) ?? null,
    membershipEndsAt: member.membershipEndsAt?.toISOString().slice(0, 10) ?? null,
  };
}

@Injectable()
export class MemberService {
  constructor(private readonly repository: MemberRepository) {}

  async list(
    actor: AuthenticatedUser,
    query?: string,
  ): Promise<MemberView[]> {
    const search = query?.trim();
    if (search && search.length > 100) {
      throw new BadRequestException('Search text must be 100 characters or fewer.');
    }
    const records = await this.repository.findMany(actor.associationId, {
      ...(!readAllRoles.includes(actor.role) ? { userId: actor.userId } : {}),
      ...(search ? { search } : {}),
    });
    return records.map(toMemberView);
  }

  async get(actor: AuthenticatedUser, id: string): Promise<MemberView> {
    this.validateId(id);
    const member = await this.repository.findById(actor.associationId, id);
    if (!member || (!readAllRoles.includes(actor.role) && member.userId !== actor.userId)) {
      throw new NotFoundException('Member not found.');
    }
    return toMemberView(member);
  }

  async create(actor: AuthenticatedUser, body: unknown): Promise<MemberView> {
    this.assertCanManage(actor);
    const data = this.parseChanges(body, true);
    try {
      const member = await this.repository.create(actor.associationId, {
        name: data.name,
        email: data.email,
        status: data.status ?? 'ACTIVE',
        membershipStartsAt: data.membershipStartsAt,
        membershipEndsAt: data.membershipEndsAt,
      });
      return toMemberView(member);
    } catch (error) {
      if (error instanceof DuplicateMemberError) {
        throw new ConflictException('A member with this email already exists in the association.');
      }
      throw error;
    }
  }

  async update(
    actor: AuthenticatedUser,
    id: string,
    body: unknown,
  ): Promise<MemberView> {
    this.assertCanManage(actor);
    this.validateId(id);
    const changes = this.parseChanges(body, false);
    const existing = await this.repository.findById(actor.associationId, id);
    if (!existing) throw new NotFoundException('Member not found.');
    const startsAt = Object.hasOwn(changes, 'membershipStartsAt')
      ? changes.membershipStartsAt
      : existing.membershipStartsAt;
    const endsAt = Object.hasOwn(changes, 'membershipEndsAt')
      ? changes.membershipEndsAt
      : existing.membershipEndsAt;
    if (startsAt && endsAt && startsAt > endsAt) {
      throw new BadRequestException('Membership start date must not be after its end date.');
    }
    try {
      const member = await this.repository.update(
        actor.associationId,
        id,
        changes,
      );
      if (!member) throw new NotFoundException('Member not found.');
      return toMemberView(member);
    } catch (error) {
      if (error instanceof DuplicateMemberError) {
        throw new ConflictException('A member with this email already exists in the association.');
      }
      throw error;
    }
  }

  async delete(actor: AuthenticatedUser, id: string): Promise<void> {
    this.assertCanManage(actor);
    this.validateId(id);
    const deleted = await this.repository.delete(actor.associationId, id);
    if (!deleted) throw new NotFoundException('Member not found.');
  }

  private assertCanManage(actor: AuthenticatedUser): void {
    if (!managementRoles.includes(actor.role)) {
      throw new ForbiddenException('Only association presidents and administrators can manage members.');
    }
  }

  private validateId(id: string): void {
    if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) {
      throw new BadRequestException('Member id must be a valid UUID.');
    }
  }

  private parseChanges(
    body: unknown,
    creating: true,
  ): MemberChanges & { name: string; email: string };
  private parseChanges(body: unknown, creating: false): MemberChanges;
  private parseChanges(
    body: unknown,
    creating: boolean,
  ): MemberChanges & { name?: string; email?: string } {
    if (!isRecord(body)) throw new BadRequestException('Member details are required.');
    const changes: MemberChanges = {};

    if (creating || body.name !== undefined) {
      if (typeof body.name !== 'string') {
        throw new BadRequestException('Name is required.');
      }
      const name = body.name.trim();
      if (!name || name.length > 120) {
        throw new BadRequestException('Name must be between 1 and 120 characters.');
      }
      changes.name = name;
    }

    if (creating || body.email !== undefined) {
      if (typeof body.email !== 'string') {
        throw new BadRequestException('Email is required.');
      }
      const email = body.email.trim().toLowerCase();
      if (email.length > 254 || !emailPattern.test(email)) {
        throw new BadRequestException('A valid email address is required.');
      }
      changes.email = email;
    }

    if (body.status !== undefined) {
      if (
        typeof body.status !== 'string' ||
        !['active', 'pending', 'expired'].includes(body.status)
      ) {
        throw new BadRequestException('Status must be active, pending, or expired.');
      }
      const statuses: Record<string, MembershipStatus> = {
        active: 'ACTIVE',
        pending: 'PENDING',
        expired: 'EXPIRED',
      };
      changes.status = statuses[body.status];
    } else if (creating) {
      changes.status = 'ACTIVE';
    }

    const membershipStartsAt = parseDate(
      body.membershipStartsAt,
      'Membership start date',
    );
    const membershipEndsAt = parseDate(
      body.membershipEndsAt,
      'Membership end date',
    );
    if (membershipStartsAt !== undefined) {
      changes.membershipStartsAt = membershipStartsAt;
    }
    if (membershipEndsAt !== undefined) {
      changes.membershipEndsAt = membershipEndsAt;
    }
    if (
      changes.membershipStartsAt &&
      changes.membershipEndsAt &&
      changes.membershipStartsAt > changes.membershipEndsAt
    ) {
      throw new BadRequestException('Membership start date must not be after its end date.');
    }

    if (!creating && Object.keys(changes).length === 0) {
      throw new BadRequestException('At least one member field must be provided.');
    }
    return changes;
  }
}

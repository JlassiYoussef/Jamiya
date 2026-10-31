import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MembershipStatus, Role } from '../generated/prisma/client.js';
import { jest } from '@jest/globals';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import {
  DuplicateMemberError,
  MemberRepository,
} from './member.repository.js';
import { MemberService } from './member.service.js';

describe('MemberService', () => {
  const repository = {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let service: MemberService;
  const actor = (role: Role = Role.PRESIDENT): AuthenticatedUser => ({
    userId: 'user-1',
    associationId: 'association-1',
    associationName: 'Association Nour',
    memberId: null,
    name: 'Youssef',
    email: 'youssef@example.tn',
    role,
    sessionId: 'session-1',
  });
  const member = (overrides: Record<string, unknown> = {}) => ({
    id: '1ec2e01e-8576-4db5-9652-0252ce9f198f',
    userId: null,
    name: 'Amira Ben Salem',
    email: 'amira@example.tn',
    status: MembershipStatus.ACTIVE,
    joinedAt: new Date('2026-10-19T12:00:00.000Z'),
    membershipStartsAt: null,
    membershipEndsAt: null,
    ...overrides,
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: MemberRepository, useValue: repository },
      ],
    }).compile();
    service = module.get(MemberService);
  });

  it('creates members in the authenticated association and normalizes email', async () => {
    repository.create.mockResolvedValue(member());

    await service.create(actor(), {
      name: '  Amira Ben Salem ',
      email: ' AMIRA@EXAMPLE.TN ',
    });

    expect(repository.create).toHaveBeenCalledWith('association-1', {
      name: 'Amira Ben Salem',
      email: 'amira@example.tn',
      status: MembershipStatus.ACTIVE,
      membershipStartsAt: undefined,
      membershipEndsAt: undefined,
    });
  });

  it('maps association-local duplicate emails to a conflict', async () => {
    repository.create.mockRejectedValue(new DuplicateMemberError());

    await expect(
      service.create(actor(), { name: 'Amira', email: 'amira@example.tn' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('limits members and volunteers to their own linked profile', async () => {
    repository.findMany.mockResolvedValue([]);

    await service.list(actor(Role.MEMBER));

    expect(repository.findMany).toHaveBeenCalledWith('association-1', {
      userId: 'user-1',
    });
  });

  it('allows treasurers to read association members but not manage them', async () => {
    repository.findMany.mockResolvedValue([]);
    await service.list(actor(Role.TREASURER));
    expect(repository.findMany).toHaveBeenCalledWith('association-1', {});

    await expect(
      service.create(actor(Role.TREASURER), {
        name: 'Amira',
        email: 'amira@example.tn',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not reveal members belonging to another association', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.get(actor(), '1ec2e01e-8576-4db5-9652-0252ce9f198f'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith(
      'association-1',
      '1ec2e01e-8576-4db5-9652-0252ce9f198f',
    );
  });

  it('validates optional membership date order on creation', async () => {
    await expect(
      service.create(actor(), {
        name: 'Amira',
        email: 'amira@example.tn',
        membershipStartsAt: '2026-10-20',
        membershipEndsAt: '2026-10-19',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('preserves date ordering when only one membership boundary is updated', async () => {
    repository.findById.mockResolvedValue(
      member({ membershipStartsAt: new Date('2026-10-20T00:00:00.000Z') }),
    );

    await expect(
      service.update(actor(), '1ec2e01e-8576-4db5-9652-0252ce9f198f', {
        membershipEndsAt: '2026-10-19',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('rejects malformed member identifiers before accessing persistence', async () => {
    await expect(service.get(actor(), 'not-a-uuid')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });
});

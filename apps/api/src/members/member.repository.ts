import { Injectable } from '@nestjs/common';
import { MembershipStatus, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export class DuplicateMemberError extends Error {}

export type MemberChanges = {
  name?: string;
  email?: string;
  status?: MembershipStatus;
  membershipStartsAt?: Date | null;
  membershipEndsAt?: Date | null;
};

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(
    associationId: string,
    options: { userId?: string; search?: string } = {},
  ) {
    return this.prisma.member.findMany({
      where: {
        associationId,
        ...(options.userId ? { userId: options.userId } : {}),
        ...(options.search
          ? {
              OR: [
                { name: { contains: options.search, mode: 'insensitive' } },
                { email: { contains: options.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  findById(associationId: string, id: string) {
    return this.prisma.member.findFirst({
      where: { associationId, id },
    });
  }

  async create(
    associationId: string,
    data: Required<Pick<MemberChanges, 'name' | 'email' | 'status'>> &
      Pick<MemberChanges, 'membershipStartsAt' | 'membershipEndsAt'>,
  ) {
    try {
      return await this.prisma.member.create({
        data: { associationId, ...data },
      });
    } catch (error) {
      this.throwIfDuplicateEmail(error);
      throw error;
    }
  }

  async update(associationId: string, id: string, data: MemberChanges) {
    try {
      const result = await this.prisma.member.updateMany({
        where: { associationId, id },
        data,
      });
      if (result.count === 0) return null;
      return this.findById(associationId, id);
    } catch (error) {
      this.throwIfDuplicateEmail(error);
      throw error;
    }
  }

  async delete(associationId: string, id: string): Promise<boolean> {
    const result = await this.prisma.member.deleteMany({
      where: { associationId, id },
    });
    return result.count > 0;
  }

  private throwIfDuplicateEmail(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new DuplicateMemberError('Email already belongs to a member.');
    }
  }
}

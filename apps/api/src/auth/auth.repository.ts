import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserForLogin(associationSlug: string, email: string) {
    return this.prisma.user.findFirst({
      where: { association: { slug: associationSlug }, email },
      include: { association: true, member: { select: { id: true } } },
    });
  }

  createSession(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prisma.session.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  findSession(tokenHash: string) {
    return this.prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            association: true,
            member: { select: { id: true } },
          },
        },
      },
    });
  }

  deleteSession(tokenHash: string) {
    return this.prisma.session.deleteMany({ where: { tokenHash } });
  }
}

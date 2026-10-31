import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { AuthRepository } from './auth.repository.js';
import { hashPassword, verifyPassword } from './password-hasher.js';
import { AuthenticatedUser, toAuthResponse } from './auth.types.js';

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const dummyPasswordHash = hashPassword(randomBytes(32).toString('hex'));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(body: unknown) {
    if (!isRecord(body)) throw new BadRequestException('Invalid login details.');
    const associationSlug =
      typeof body.associationSlug === 'string'
        ? body.associationSlug.trim().toLowerCase()
        : '';
    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (
      associationSlug.length > 80 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(associationSlug) ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 1 ||
      password.length > 1024
    ) {
      throw new BadRequestException('Invalid login details.');
    }

    const user = await this.repository.findUserForLogin(associationSlug, email);
    const passwordMatches = await verifyPassword(
      password,
      user?.passwordHash ?? (await dummyPasswordHash),
    );
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid association, email, or password.');
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const session = await this.repository.createSession(
      user.id,
      this.hashToken(token),
      expiresAt,
    );
    const authenticatedUser = this.toAuthenticatedUser(session.id, user);
    return toAuthResponse(authenticatedUser, token, expiresAt);
  }

  async authenticate(token: string): Promise<AuthenticatedUser> {
    if (!/^[\w-]{40,60}$/.test(token)) {
      throw new UnauthorizedException('Authentication required.');
    }
    const session = await this.repository.findSession(this.hashToken(token));
    if (!session) throw new UnauthorizedException('Authentication required.');
    if (session.expiresAt <= new Date()) {
      await this.repository.deleteSession(session.tokenHash);
      throw new UnauthorizedException('Session expired. Please sign in again.');
    }
    return this.toAuthenticatedUser(session.id, session.user);
  }

  async logout(token: string): Promise<void> {
    await this.repository.deleteSession(this.hashToken(token));
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toAuthenticatedUser(
    sessionId: string,
    user: {
      id: string;
      associationId: string;
      name: string;
      email: string;
      role: AuthenticatedUser['role'];
      association: { name: string };
      member: { id: string } | null;
    },
  ): AuthenticatedUser {
    return {
      userId: user.id,
      associationId: user.associationId,
      associationName: user.association.name,
      memberId: user.member?.id ?? null,
      name: user.name,
      email: user.email,
      role: user.role,
      sessionId,
    };
  }
}

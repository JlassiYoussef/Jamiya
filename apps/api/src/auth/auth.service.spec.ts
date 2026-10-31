import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Role } from '../generated/prisma/client.js';
import { createHash, randomBytes } from 'node:crypto';
import { jest } from '@jest/globals';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { hashPassword } from './password-hasher.js';

describe('AuthService', () => {
  const repository = {
    findUserForLogin: jest.fn(),
    createSession: jest.fn(),
    findSession: jest.fn(),
    deleteSession: jest.fn(),
  };
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: repository },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('normalizes login identifiers and persists only a hash of the session token', async () => {
    repository.findUserForLogin.mockResolvedValue({
      id: 'user-1',
      associationId: 'association-1',
      name: 'President',
      email: 'president@example.tn',
      role: Role.PRESIDENT,
      passwordHash: await hashPassword('correct horse battery staple'),
      association: { name: 'Association Nour' },
      member: null,
    });
    repository.createSession.mockResolvedValue({ id: 'session-1' });

    const response = await service.login({
      associationSlug: ' Association-Nour ',
      email: ' PRESIDENT@example.tn ',
      password: 'correct horse battery staple',
    });

    expect(repository.findUserForLogin).toHaveBeenCalledWith(
      'association-nour',
      'president@example.tn',
    );
    expect(response.user.role).toBe('president');
    expect(response.user.associationName).toBe('Association Nour');
    expect(response.token).toHaveLength(43);
    expect(repository.createSession).toHaveBeenCalledWith(
      'user-1',
      createHash('sha256').update(response.token).digest('hex'),
      expect.any(Date),
    );
  });

  it('rejects invalid credentials with a generic authorization error', async () => {
    repository.findUserForLogin.mockResolvedValue(null);

    await expect(
      service.login({
        associationSlug: 'association-nour',
        email: 'missing@example.tn',
        password: 'not-the-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(repository.createSession).not.toHaveBeenCalled();
  });

  it('rejects malformed login details before querying the repository', async () => {
    await expect(
      service.login({ associationSlug: 'bad slug', email: 'not-an-email', password: '' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.findUserForLogin).not.toHaveBeenCalled();
  });

  it('loads the user role and association from the stored session', async () => {
    const token = randomBytes(32).toString('base64url');
    repository.findSession.mockResolvedValue({
      id: 'session-1',
      tokenHash: createHash('sha256').update(token).digest('hex'),
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'user-1',
        associationId: 'association-1',
        name: 'Treasurer',
        email: 'treasurer@example.tn',
        role: Role.TREASURER,
        association: { name: 'Association Nour' },
        member: { id: 'member-1' },
      },
    });

    await expect(service.authenticate(token)).resolves.toMatchObject({
      userId: 'user-1',
      associationId: 'association-1',
      memberId: 'member-1',
      role: Role.TREASURER,
    });
    expect(repository.findSession).toHaveBeenCalledWith(
      createHash('sha256').update(token).digest('hex'),
    );
  });

  it('revokes expired sessions instead of authenticating them', async () => {
    repository.findSession.mockResolvedValue({
      id: 'session-1',
      tokenHash: 'stored-token-hash',
      expiresAt: new Date(Date.now() - 1),
      user: {},
    });

    await expect(
      service.authenticate(randomBytes(32).toString('base64url')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(repository.deleteSession).toHaveBeenCalledWith('stored-token-hash');
  });
});

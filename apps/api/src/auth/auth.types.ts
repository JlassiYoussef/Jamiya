import type { Role } from '../generated/prisma/client.js';

export type AuthenticatedUser = {
  userId: string;
  associationId: string;
  associationName: string;
  memberId: string | null;
  name: string;
  email: string;
  role: Role;
  sessionId: string;
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: Omit<AuthenticatedUser, 'sessionId' | 'userId' | 'associationId' | 'role'> & {
    id: string;
    associationId: string;
    role: Lowercase<Role>;
  };
};

const publicRoles: Record<Role, Lowercase<Role>> = {
  PRESIDENT: 'president',
  ADMINISTRATOR: 'administrator',
  TREASURER: 'treasurer',
  MEMBER: 'member',
  VOLUNTEER: 'volunteer',
};

export const toAuthResponse = (
  user: AuthenticatedUser,
  token?: string,
  expiresAt?: Date,
) => {
  const result: { user: AuthResponse['user'] } = {
    user: {
      id: user.userId,
      associationId: user.associationId,
      associationName: user.associationName,
      memberId: user.memberId,
      name: user.name,
      email: user.email,
      role: publicRoles[user.role],
    },
  };
  return token && expiresAt
    ? { ...result, token, expiresAt: expiresAt.toISOString() }
    : result;
};

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashPassword } from '../src/auth/password-hasher.ts';

const rootEnv = resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) loadEnvFile(rootEnv);
if (existsSync('.env')) loadEnvFile('.env');

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be set before running the seed.`);
  return value;
};

async function seed(): Promise<void> {
  const associationSlug = required('SEED_ASSOCIATION_SLUG').toLowerCase();
  const associationName = required('SEED_ASSOCIATION_NAME');
  const adminName = required('SEED_ADMIN_NAME');
  const adminEmail = required('SEED_ADMIN_EMAIL').toLowerCase();
  const adminPassword = required('SEED_ADMIN_PASSWORD');

  if (adminPassword.length < 12 || adminPassword.length > 1024) {
    throw new Error('SEED_ADMIN_PASSWORD must be between 12 and 1024 characters.');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(associationSlug)) {
    throw new Error('SEED_ASSOCIATION_SLUG must be lowercase words separated by hyphens.');
  }
  if (adminEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    throw new Error('SEED_ADMIN_EMAIL must be a valid email address.');
  }

  const databaseUrl = required('DATABASE_URL');
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  try {
    const association = await prisma.association.upsert({
      where: { slug: associationSlug },
      update: { name: associationName },
      create: { slug: associationSlug, name: associationName },
    });
    await prisma.user.upsert({
      where: {
        associationId_email: { associationId: association.id, email: adminEmail },
      },
      update: {},
      create: {
        associationId: association.id,
        name: adminName,
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        role: 'PRESIDENT',
      },
    });
    console.info(`Seeded association "${association.slug}" and its president account.`);
  } finally {
    await prisma.$disconnect();
  }
}

await seed();

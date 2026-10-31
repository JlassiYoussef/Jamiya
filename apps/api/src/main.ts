import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const rootEnv = resolve(process.cwd(), '../../.env');
  if (existsSync(rootEnv)) loadEnvFile(rootEnv);
  if (existsSync('.env')) loadEnvFile('.env');
  const app = await NestFactory.create(AppModule);
  const origins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.WEB_ORIGIN,
  ].filter((origin): origin is string => Boolean(origin)));
  app.enableCors({ origin: [...origins] });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import type { AuthenticatedUser } from './auth.types.js';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  sessionToken: string;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer ([\w-]+)$/);
    if (!match) throw new UnauthorizedException('Authentication required.');
    request.sessionToken = match[1];
    request.user = await this.authService.authenticate(match[1]);
    return true;
  }
}

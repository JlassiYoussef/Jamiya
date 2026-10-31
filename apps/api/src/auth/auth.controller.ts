import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthenticatedRequest } from './session-auth.guard.js';
import { SessionAuthGuard } from './session-auth.guard.js';
import { toAuthResponse } from './auth.types.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Req() request: AuthenticatedRequest) {
    return this.authService.login(request.body);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  currentUser(@Req() request: AuthenticatedRequest) {
    return toAuthResponse(request.user);
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  async logout(@Req() request: AuthenticatedRequest) {
    await this.authService.logout(request.sessionToken);
    return { success: true };
  }
}

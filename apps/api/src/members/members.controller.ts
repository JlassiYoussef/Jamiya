import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Role } from '../generated/prisma/client.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { SessionAuthGuard } from '../auth/session-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/session-auth.guard.js';
import { MemberService } from './member.service.js';

const associationRoles: Role[] = [
  'PRESIDENT',
  'ADMINISTRATOR',
  'TREASURER',
  'MEMBER',
  'VOLUNTEER',
];
const managementRoles: Role[] = ['PRESIDENT', 'ADMINISTRATOR'];

@Controller('api/members')
@UseGuards(SessionAuthGuard, RolesGuard)
export class MembersController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @Roles(...associationRoles)
  list(@Req() request: AuthenticatedRequest, @Query('q') query?: string) {
    return this.memberService.list(request.user, query);
  }

  @Get(':id')
  @Roles(...associationRoles)
  get(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.memberService.get(request.user, id);
  }

  @Post()
  @Roles(...managementRoles)
  create(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    return this.memberService.create(request.user, body);
  }

  @Patch(':id')
  @Roles(...managementRoles)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.memberService.update(request.user, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(...managementRoles)
  delete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.memberService.delete(request.user, id);
  }
}

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MembersController } from './members.controller.js';
import { MemberRepository } from './member.repository.js';
import { MemberService } from './member.service.js';

@Module({
  imports: [AuthModule],
  controllers: [MembersController],
  providers: [MemberRepository, MemberService],
})
export class MembersModule {}

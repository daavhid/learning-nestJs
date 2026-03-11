import { Controller } from '@nestjs/common';
import { ConversationMemberService } from './conversation-member.service';

@Controller('conversation-member')
export class ConversationMemberController {
  constructor(
    private readonly conversationMemberService: ConversationMemberService,
  ) {}
}

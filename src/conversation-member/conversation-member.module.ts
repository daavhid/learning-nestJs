import { Module } from '@nestjs/common';
import { ConversationMemberService } from './conversation-member.service';
import { ConversationMemberController } from './conversation-member.controller';
import { ConversationMemberGuard } from './guards/conversation-member.guard';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationMember,
  ConversationMemberSchema,
} from './schemas/conversation-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationMember.name, schema: ConversationMemberSchema },
    ]),
  ],
  controllers: [ConversationMemberController],
  providers: [ConversationMemberService, ConversationMemberGuard],
  exports: [
    ConversationMemberService,
    ConversationMemberGuard,
    MongooseModule.forFeature([
      { name: ConversationMember.name, schema: ConversationMemberSchema },
    ]),
  ],
})
export class ConversationMemberModule {}

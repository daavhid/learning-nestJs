/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationMemberService } from 'src/conversation-member/conversation-member.service';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private memberService: ConversationMemberService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const messageId = request.params.messageId;

    const message = await this.messageModel.findById(messageId);

    if (!message || message.deletedForEveryone)
      throw new NotFoundException('Message not found');

    const member = await this.memberService.findOneUserConversation(
      message?.conversationId._id.toString(),
      user._id,
    );

    if (!member)
      throw new ForbiddenException('You are not a member of this conversation');

    if (member.isBanned)
      throw new ForbiddenException(
        'You have been banned from this conversation',
      );

    request.memberContext = member;
    return true;
  }
}

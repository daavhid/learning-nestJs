/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationMember } from '../schemas/conversation-member.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConversationMemberGuard implements CanActivate {
  constructor(
    @InjectModel(ConversationMember.name)
    private readonly memberModel: Model<ConversationMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const conversationId = request.body?.conversationId || request.params.id;
    console.log(conversationId, 'this is the conversationId in the guard');

    if (!user._id || !conversationId) return false;

    const member = await this.memberModel.findOne({
      conversationId,
      userId: user._id,
    });

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

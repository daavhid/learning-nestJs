import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationMember } from './schemas/conversation-member.schema';
import { Model, Types } from 'mongoose';
import { MessageDocument } from 'src/message/schemas/message.schema';
import { cursorPaginationResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class ConversationMemberService {
  constructor(
    @InjectModel(ConversationMember.name)
    private memberModel: Model<ConversationMember>,
  ) {}
  async addMembersToConversation(
    conversationId: Types.ObjectId,
    participantIds: Types.ObjectId[],
  ) {
    //support bulk user addition later

    const memberDocs = participantIds.map((id) => {
      return {
        conversationId: conversationId.toString(),
        userId: id.toString(),
      };
    });

    return await this.memberModel.insertMany(memberDocs, { ordered: false });
  }

  async findOneUserConversations(
    queryBuilder: Record<string, any>,
    limit: number,
  ) {
    const conversations = await this.memberModel
      .find(queryBuilder)
      .sort({ conversationLastMessageAt: -1 })
      .limit(limit + 1)
      .exec();

    return conversations;
  }
  async findOneUserConversation(conversationId: string, userId: string) {
    return await this.memberModel.findOne({
      conversationId,
      userId,
    });
  }
  async findByConversationId(conversationId: string, currentUserId: string) {
    return await this.memberModel.find({
      conversationId,
      userId: { $ne: currentUserId },
    });
  }
  async removeMembers(conversationId: string, participantIds: string[]) {
    return await this.memberModel.deleteMany({
      conversationId: conversationId,
      userId: { $in: participantIds },
    });
  }

  async removeAllMembers(conversationId: Types.ObjectId) {
    return await this.memberModel.deleteMany({
      conversationId: conversationId,
    });
  }

  async updateConversationLastMessageAt(
    conversationId: string,
    message: MessageDocument,
  ) {
    await this.memberModel.updateMany(
      {
        conversationId: conversationId,
      },
      {
        $set: {
          conversationLastMessageAt: message.createdAt,
          conversationLastMessage: message._id,
        },
      },
    );
  }

  async updateMemberLastReadMessage(
    message: MessageDocument,
    currentUserId: string,
  ) {
    await this.memberModel.findOneAndUpdate(
      {
        conversationId: message.conversationId._id,
        userId: currentUserId,
      },
      { $set: { lastReadMessageAt: new Date() } },
    );
  }

  async getMembersWhoRead(
    message: MessageDocument,
    cursor: string,
    limit: number,
  ): Promise<cursorPaginationResponse<ConversationMember>> {
    const query: Record<string, any> = {
      lastReadMessageAt: { $gte: message.createdAt },
      userId: { $ne: message.sender._id },
    };

    if (cursor) {
      query.lastReadMessageAt = {
        $gte: message.createdAt,
        $lt: new Date(cursor),
      };
    }
    const members = await this.memberModel
      .find(query)
      .populate('userId', '_id name avatar')
      .select(['lastReadMessageAt', 'userId'])
      .sort({ lastReadMessageAt: -1 })
      .limit(limit + 1)
      .exec();

    const hasNextPage = members.length > limit;
    const newMember = members.slice(0, limit);
    const newCursor = hasNextPage
      ? newMember[newMember.length - 1].lastReadMessageAt!
      : null;

    return {
      data: newMember,
      meta: {
        cursor: newCursor,
        hasNextPage,
      },
    };
  }
}

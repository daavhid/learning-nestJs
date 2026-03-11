/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Model, Types } from 'mongoose';
import { ConversationQueryDto } from './dto/conversation-query.dto';
import { cursorPaginationResponse } from 'src/common/interface/pagination.interface';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { User } from 'src/users/schemas/user.schema';
import { ConversationMemberService } from 'src/conversation-member/conversation-member.service';
import { createHash } from 'crypto';
import { ConversationMemberDoc } from 'src/conversation-member/schemas/conversation-member.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly conversationMemberService: ConversationMemberService,
  ) {}

  async createPrivateConversation(
    currentUserId: string,
    { participantId }: CreatePrivateConversationDto,
  ) {
    const memberHash = this.generatePrivateConversationHash([
      currentUserId,
      participantId,
    ]);
    const existingPrivateConversation = await this.conversationModel
      .findOne({
        memberHash,
      })
      .populate('lastMessage');

    if (existingPrivateConversation) return existingPrivateConversation;

    const newPrivateConversation = await this.conversationModel.create({
      isGroup: false,
      memberHash,
      memberCount: 2,
    });

    await this.conversationMemberService.addMembersToConversation(
      newPrivateConversation._id,
      [new Types.ObjectId(currentUserId), new Types.ObjectId(participantId)],
    );

    return newPrivateConversation;
  }

  async createGroupConversation(
    currentUserId: string,
    { groupAvatar, groupName, participantIds }: CreateGroupConversationDto,
  ) {
    const participantsArr =
      await this.validateParticipantsForGroup(participantIds);
    const newGroupConversation = await this.conversationModel.create({
      isGroup: true,
      groupName: groupName,
      groupOwner: currentUserId,
      groupAvatar: groupAvatar,
    });

    const newMemb =
      await this.conversationMemberService.addMembersToConversation(
        newGroupConversation._id,
        [new Types.ObjectId(currentUserId), ...participantsArr],
      );
    console.log(newMemb.length);
    newGroupConversation.memberCount = newMemb.length;
    await newGroupConversation.save();

    return newGroupConversation;
  }

  async getAllConversations(
    currentUserId: string,
    { cursor, limit }: ConversationQueryDto,
  ): Promise<cursorPaginationResponse<ConversationMemberDoc>> {
    const queryBuilder: Record<string, any> = {
      userId: currentUserId,
    };
    if (cursor) {
      queryBuilder.conversationLastMessageAt = { $lt: new Date(cursor) };
    }
    const conversations =
      await this.conversationMemberService.findOneUserConversations(
        queryBuilder,
        limit,
      );

    const hasNextPage = conversations.length > limit;
    const newConversations = conversations.slice(0, limit);
    console.log(newConversations.length);
    const newCursor = hasNextPage
      ? newConversations[
          newConversations.length - 1
        ].conversationLastMessageAt?.toISOString()
      : null;
    return {
      data: newConversations,
      meta: {
        cursor: newCursor as string | null,
        hasNextPage,
      },
    };
  }

  async getOneConversation(id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants', '_id name email avatar')
      .populate('lastMessage', '_id text sender');

    if (!conversation) throw new NotFoundException('conversation not found');
    return conversation;
  }

  async updateConversation(
    currentUserId: string,
    id: string,
    { groupAvatar, groupName }: UpdateConversationDto,
  ) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants', '_id name email avatar');
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (currentUserId !== conversation.groupOwner?.toString())
      throw new ForbiddenException();

    conversation.groupName = groupName || conversation.groupName;
    conversation.groupAvatar = groupAvatar || conversation.groupAvatar;

    await conversation.save();

    return conversation;
  }

  async addMembersToGroup(
    currentUserId: string,
    id: string,
    { participantsId }: AddParticipantsDto,
  ) {
    //find conversation

    const conversation = await this.conversationModel.findById(id);

    if (!conversation || !conversation.isGroup)
      throw new NotFoundException('Conversation not found');

    if (conversation.groupOwner?.toString() !== currentUserId)
      throw new ForbiddenException();

    const participantsArr =
      await this.validateParticipantsForGroup(participantsId);

    let insertedCount = 0;
    try {
      const newMemb =
        await this.conversationMemberService.addMembersToConversation(
          new Types.ObjectId(id),
          participantsArr,
        );

      insertedCount = newMemb.length;
    } catch (error) {
      console.log(error.result.insertedCount);

      console.log(
        `${error.result.insertedCount} users added, some duplicates skipped.`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      insertedCount = error.result.insertedCount || 0;
    }

    if (insertedCount > 0) {
      await this.conversationModel.findByIdAndUpdate(
        id,
        {
          $inc: { memberCount: insertedCount },
        },
        { new: true },
      );
    }
  }

  async removeMembersFromGroup(
    currentUserId: string,
    id: string,
    { participantsId }: AddParticipantsDto,
  ) {
    const conversation = await this.conversationModel.findById(id);

    if (!conversation || !conversation.isGroup)
      throw new NotFoundException('Conversation not found');

    if (conversation.groupOwner?.toString() !== currentUserId)
      throw new ForbiddenException();

    await this.validateParticipantsForGroup(participantsId);

    const delMemb = await this.conversationMemberService.removeMembers(
      id,
      participantsId,
    );
    await this.conversationModel.findByIdAndUpdate(
      id,
      {
        $inc: { memberCount: -delMemb.deletedCount },
      },
      { new: true },
    );

    await conversation.save();
  }

  async remove(id: string, currentUserId: string) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (
      conversation.isGroup &&
      conversation.groupOwner?.toString() !== currentUserId
    )
      throw new ForbiddenException('only group owners can remove group');

    await conversation.deleteOne();
    await this.conversationMemberService.removeAllMembers(
      new Types.ObjectId(id),
    );
  }
  async uploadLastMessage(id: string, messageId: Types.ObjectId) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) throw new NotFoundException('Conversation not found');

    conversation.lastMessage = messageId || conversation.lastMessage;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return conversation.lastMessage;
  }

  private async validateParticipantsForGroup(participantIds: string[]) {
    const participantsArr = (
      await this.userModel
        .find({
          _id: { $in: participantIds },
        })
        .select('_id')
        .lean()
    ).map((u) => u._id);

    const participantsIdSet = new Set(
      participantsArr.map((id) => id.toString()),
    );

    if (participantsArr.length !== participantIds.length) {
      const notValidUsers = participantIds.filter(
        (id) => !participantsIdSet.has(id),
      );
      console.log(notValidUsers);
      throw new NotFoundException(
        `Some Users not found ${notValidUsers.join(', ')}`,
      );
    }

    return participantsArr;
  }

  private generatePrivateConversationHash(participantsId: string[]) {
    const sorted_Ids = participantsId.sort().join(',');

    return createHash('sha256').update(sorted_Ids).digest('hex');
  }
}

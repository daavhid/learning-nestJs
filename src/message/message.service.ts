import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageQueryDto } from './dto/message-query.dto';
import { strictCursorPaginationResponse } from 'src/common/interface/pagination.interface';
import { MessageGateway } from './message.gateway';
import { plainToInstance } from 'class-transformer';
import {
  MessageResponseDto,
  updatedMessageDto,
  updatedSeenMessageDto,
} from './dto/message-response.dto';
import { NotificationService } from 'src/notification/notification.service';
import { ConversationMemberService } from 'src/conversation-member/conversation-member.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  NotificationModel,
  NotificationType,
} from 'src/notification/constants';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly conversationService: ConversationService,
    private messageGateway: MessageGateway,
    private notificationService: NotificationService,
    private memberService: ConversationMemberService,
  ) {}

  async getMessages(
    conversationId: string,
    { createdAt, _id, search, limit }: MessageQueryDto,
    currentUserId: string,
  ): Promise<strictCursorPaginationResponse<Message>> {
    const queryBuilder: Record<string, any> = {
      conversationId,
      deletedForEveryone: false,
      deletedFor: { $ne: currentUserId },
    };

    if (createdAt && _id) {
      queryBuilder.$or = [
        {
          createdAt: { $lt: new Date(createdAt) },
        },
        {
          createdAt: new Date(createdAt),
          _id: { $lt: _id },
        },
      ];
    }

    if (search) {
      queryBuilder.text = { $regex: search, $options: 'i' };
    }
    const messages = await this.messageModel
      .find(queryBuilder)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate('sender', '_id name avatar');

    const hasNextPage = messages.length > limit;
    const newMessages = messages.slice(0, limit);
    const newCursorObj = hasNextPage
      ? {
          createdAt: newMessages[newMessages.length - 1].createdAt,
          _id: newMessages[newMessages.length - 1]._id,
        }
      : null;

    return {
      data: newMessages,
      meta: {
        cursor: newCursorObj,
        hasNextPage: hasNextPage,
      },
    };
  }

  //configure real time features for these endpoint

  async sendMessage(
    { text, mediaFiles }: CreateMessageDto,
    currentUserId: string,
    currentUser: UserDocument,
    conversationId: string,
  ) {
    const recipientsList = await this.memberService.findByConversationId(
      conversationId,
      currentUserId,
    );

    console.log(text, currentUserId, conversationId);
    const newMessage = await this.messageModel.create({
      sender: currentUserId,
      conversationId: { _id: new Types.ObjectId(conversationId) },
      text,
      mediaFiles,
    });

    await newMessage.populate('sender', '_id name avatar email');

    const responseMessageDto = plainToInstance(MessageResponseDto, newMessage, {
      excludeExtraneousValues: true,
    });

    await Promise.all([
      this.conversationService.uploadLastMessage(
        conversationId,
        newMessage._id,
      ),
      this.memberService.updateConversationLastMessageAt(
        conversationId,
        newMessage,
      ),
      this.memberService.updateMemberLastReadMessage(newMessage, currentUserId),
      this.notificationService.createNotification({
        sender: currentUser,
        recipients: recipientsList.map((item) => item._id),
        targetResourceId: conversationId,
        onModel: NotificationModel.CONVERSATION,
        type: NotificationType.NEW_MESSAGE_SENT,
      }),
    ]);

    this.messageGateway.handleSendMessage(responseMessageDto);

    return newMessage;
  }

  async updateMessage(
    messageId: string,
    currentUserId: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
        sender: currentUserId,
      },
      updateMessageDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!message)
      throw new NotFoundException(
        'Message not found or you are not authorized to perform this action ',
      );

    const updatedMessage = plainToInstance(
      updatedMessageDto,
      { _id: message._id, ...updateMessageDto },
      { excludeExtraneousValues: true },
    );

    this.messageGateway.handleUpdateMessage(
      message.conversationId._id.toString(),
      updatedMessage,
    );

    return message;
  }

  async markMessageAsSeen(messageId: string, currentUser: UserDocument) {
    const message = await this.messageModel
      .findById(messageId)
      .populate('conversationId');
    if (!message || message.deletedForEveryone)
      throw new NotFoundException('Message not found');

    await this.memberService.updateMemberLastReadMessage(
      message,
      currentUser._id.toString(),
    );

    const newSeenMessageObject = plainToInstance(
      updatedSeenMessageDto,
      { _id: message._id, seenBy: currentUser },
      { excludeExtraneousValues: true },
    );

    this.messageGateway.handleMarkMessageAsSeen(
      message.sender._id.toString(),
      newSeenMessageObject,
    );
  }

  async getMembersWhoRead(
    messageId: string,
    { cursor, limit }: MessageQueryDto,
  ) {
    const message = await this.messageModel.findById(messageId);
    return await this.memberService.getMembersWhoRead(message!, cursor, limit);
  }

  async deleteMessageForEveryone(messageId: string, currentUserId: string) {
    const message = await this.messageModel.findById(messageId);
    if (message?.sender._id.toString() !== currentUserId)
      throw new ForbiddenException();

    message.deletedForEveryone = true;
    await message.save();

    this.messageGateway.handleDeleteMessage(
      message.conversationId._id.toString(),
      message._id.toString(),
    );
  }

  async deleteMessageForMe(messageId: string, currentUserId: string) {
    const message = await this.messageModel
      .findById(messageId)
      .populate('conversationId', 'participants');
    if (!message || message.deletedForEveryone)
      throw new NotFoundException('Message not found');

    message.deletedFor.push(new Types.ObjectId(currentUserId));
    await message.save();

    this.messageGateway.handleDeleteMessageForMe(
      currentUserId,
      message._id.toString(),
    );
  }

  private convertMongoIdArraytoSet(list: Types.ObjectId[]) {
    return new Set(list.map((objectId) => objectId.toString()));
  }
}

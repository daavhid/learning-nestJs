import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { MessageQueryDto } from './dto/message-query.dto';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import {
  memberWhoReadMessageDto,
  MessageResponseDto,
} from './dto/message-response.dto';
import { Types } from 'mongoose';
import { ConversationMemberGuard } from 'src/conversation-member/guards/conversation-member.guard';
import { MessageGuard } from './guards/message.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateDoc,
  ApiGetManyDoc,
  ApiUpdateDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('messages')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiCreateDoc({
    summary: 'Send message',
    description: 'Send a message to a conversation',
    auth: true,
    body: CreateMessageDto,
    response: MessageResponseDto,
  })
  @UseGuards(ConversationMemberGuard)
  @TransformDto(MessageResponseDto)
  @Post('conversation/:id')
  sendMessage(
    @Param('id', ParseObjectIdPipe) conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.messageService.sendMessage(
      createMessageDto,
      currentUser._id.toString(),
      currentUser,
      conversationId,
    );
  }

  @ApiGetManyDoc({
    summary: 'Get messages',
    description: 'Get messages from a conversation',
    auth: true,
    response: MessageResponseDto,
    isArray: true,
    queries: [
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of messages to return',
        example: 20,
      },
      {
        name: 'offset',
        type: Number,
        required: false,
        description: 'Number of messages to skip',
        example: 0,
      },
    ],
  })
  @UseGuards(ConversationMemberGuard)
  @TransformDto(MessageResponseDto)
  @Get('/conversation/:id')
  getMessages(
    @Param('id', ParseObjectIdPipe) conversationId: Types.ObjectId,
    @Query() messageQueryDto: MessageQueryDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    console.log(messageQueryDto);
    return this.messageService.getMessages(
      conversationId._id.toString(),
      messageQueryDto,
      currentUser._id.toString(),
    );
  }

  @ApiGetManyDoc({
    summary: 'Get members who read message',
    description: 'Get list of members who have read a specific message',
    auth: true,
    response: memberWhoReadMessageDto,
    isArray: true,
  })
  @UseGuards(MessageGuard)
  @TransformDto(memberWhoReadMessageDto)
  @Get('/:messageId/readBy')
  getMembersWhoRead(
    @Param('messageId', ParseObjectIdPipe) messageId: string,
    @Query() messageQueryDto: MessageQueryDto,
  ) {
    return this.messageService.getMembersWhoRead(messageId, messageQueryDto);
  }

  @ApiUpdateDoc({
    summary: 'Update message',
    description: 'Update a message content',
    auth: true,
    body: UpdateMessageDto,
    response: MessageResponseDto,
    params: [
      {
        name: 'messageId',
        description: 'The ID of the message to update',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @UseGuards(MessageGuard)
  @Patch('/:messageId')
  updateMessage(
    @Param('messageId', ParseObjectIdPipe) messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.messageService.updateMessage(
      messageId,
      currentUser._id.toString(),
      updateMessageDto,
    );
  }

  @ApiUpdateDoc({
    summary: 'Mark message as seen',
    description: 'Mark a message as read by the current user',
    auth: true,
    response: Object,
    params: [
      {
        name: 'messageId',
        description: 'The ID of the message to mark as seen',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @UseGuards(MessageGuard)
  @Patch(':messageId/seen')
  markMessageAsSeen(
    @Param('messageId', ParseObjectIdPipe) messageId: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.messageService.markMessageAsSeen(messageId, currentUser);
  }

  @ApiUpdateDoc({
    summary: 'Delete message for me',
    description: 'Delete a message only for the current user',
    auth: true,
    response: Object,
    params: [
      {
        name: 'messageId',
        description: 'The ID of the message to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @UseGuards(MessageGuard)
  @Patch(':messageId/deleteForMe')
  deleteMessageForMe(
    @Param('messageId', ParseObjectIdPipe) messageId: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.messageService.deleteMessageForMe(
      messageId,
      currentUser._id.toString(),
    );
  }

  @ApiUpdateDoc({
    summary: 'Delete message for everyone',
    description: 'Delete a message for all conversation members',
    auth: true,
    response: Object,
    params: [
      {
        name: 'messageId',
        description: 'The ID of the message to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @UseGuards(MessageGuard)
  @Patch(':messageId/deleteForEveryone')
  deleteMessageForEveryone(
    @Param('messageId', ParseObjectIdPipe) messageId: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.messageService.deleteMessageForEveryone(
      messageId,
      currentUser._id.toString(),
    );
  }
}

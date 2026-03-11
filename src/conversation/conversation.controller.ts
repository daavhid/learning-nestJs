import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateGroupConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { ConversationQueryDto } from './dto/conversation-query.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { conversationDto } from './dto/conversation-response.dto';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateDoc,
  ApiGetManyDoc,
  ApiGetOneDoc,
  ApiUpdateDoc,
  ApiDeleteDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('conversations')
@UseGuards(JwtAuthGuard)
@TransformDto(conversationDto)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiCreateDoc({
    summary: 'Create private conversation',
    description: 'Create a private conversation between two users',
    auth: true,
    body: CreatePrivateConversationDto,
    response: conversationDto,
  })
  @Post('private')
  createPrivateConversation(
    @Body() createPrivateConversationDto: CreatePrivateConversationDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.conversationService.createPrivateConversation(
      currentUser._id.toString(),
      createPrivateConversationDto,
    );
  }

  @ApiCreateDoc({
    summary: 'Create group conversation',
    description: 'Create a group conversation with multiple participants',
    auth: true,
    body: CreateGroupConversationDto,
    response: conversationDto,
  })
  @Post('group')
  createGroupConversation(
    @Body() createGroupConversationDto: CreateGroupConversationDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.conversationService.createGroupConversation(
      currentUser._id.toString(),
      createGroupConversationDto,
    );
  }

  @ApiGetManyDoc({
    summary: 'Get all conversations',
    description: 'Get list of user conversations',
    auth: true,
    response: conversationDto,
    isArray: true,
    queries: [
      {
        name: 'search',
        type: String,
        required: false,
        description: 'Search term for conversation names',
        example: 'group chat',
      },
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of conversations to return',
        example: 10,
      },
      {
        name: 'offset',
        type: Number,
        required: false,
        description: 'Number of conversations to skip',
        example: 0,
      },
    ],
  })
  @Get()
  getAllConversations(
    @CurrentUser() currentUser: UserDocument,
    @Query() conversationQueryDto: ConversationQueryDto,
  ) {
    return this.conversationService.getAllConversations(
      currentUser._id.toString(),
      conversationQueryDto,
    );
  }

  @ApiGetOneDoc({
    summary: 'Get conversation by ID',
    description: 'Get a single conversation by its ID',
    auth: true,
    response: conversationDto,
    params: [
      {
        name: 'conversationId',
        description: 'The ID of the conversation',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Get('/:conversationId')
  getOneConversation(
    @Param('conversationId', ParseObjectIdPipe) conversationId: Types.ObjectId,
  ) {
    return this.conversationService.getOneConversation(
      conversationId.toString(),
    );
  }

  @ApiUpdateDoc({
    summary: 'Add members to group',
    description: 'Add new members to a group conversation',
    auth: true,
    body: AddParticipantsDto,
    response: conversationDto,
    params: [
      {
        name: 'conversationId',
        description: 'The ID of the conversation',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Patch(':conversationId/add-members')
  addMembersToGroup(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @CurrentUser() currentUser: UserDocument,
    @Body() addParticipantsDto: AddParticipantsDto,
  ) {
    return this.conversationService.addMembersToGroup(
      currentUser._id.toString(),
      conversationId,
      addParticipantsDto,
    );
  }

  @ApiUpdateDoc({
    summary: 'Remove members from group',
    description: 'Remove members from a group conversation',
    auth: true,
    body: AddParticipantsDto,
    response: conversationDto,
    params: [
      {
        name: 'conversationId',
        description: 'The ID of the conversation',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Patch(':conversationId/remove-members')
  removeMembersFromGroup(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @CurrentUser() currentUser: UserDocument,
    @Body() removeParticipantsDto: AddParticipantsDto,
  ) {
    return this.conversationService.removeMembersFromGroup(
      currentUser._id.toString(),
      conversationId,
      removeParticipantsDto,
    );
  }

  @ApiUpdateDoc({
    summary: 'Update conversation',
    description: 'Update conversation details',
    auth: true,
    body: UpdateConversationDto,
    response: conversationDto,
    params: [
      {
        name: 'conversationId',
        description: 'The ID of the conversation',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Patch(':conversationId')
  updateConversation(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @CurrentUser() currentUser: UserDocument,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.updateConversation(
      currentUser._id.toString(),
      conversationId,
      updateConversationDto,
    );
  }

  @ApiDeleteDoc({
    summary: 'Delete conversation',
    description: 'Delete a conversation',
    auth: true,
    params: [
      {
        name: 'conversationId',
        description: 'The ID of the conversation to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Delete(':conversationId')
  remove(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.conversationService.remove(
      conversationId,
      currentUser._id.toString(),
    );
  }
}

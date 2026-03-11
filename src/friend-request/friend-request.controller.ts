import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { IroleInRequest } from './interfaces/friend-request.interface';
import {
  friendsListResponseDto,
  PendingReceivedRequestResponseDto,
  PendingSentRequestResponseDto,
} from './dto/friend-request-reponse.dto';
import { FriendRequestQueryDto } from './dto/friend-request-query.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateDoc,
  ApiGetManyDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('friend-requests')
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @ApiCreateDoc({
    summary: 'Send friend request',
    description: 'Send a friend request to another user',
    auth: true,
    response: Object, // Assuming a response DTO
  })
  @Post('request/:receiverId')
  sendFriendRequest(
    @Param('receiverId', ParseObjectIdPipe) receiverId: Types.ObjectId,
    @CurrentUser() sender: UserDocument,
  ) {
    return this.friendRequestService.sendFriendRequest(
      sender._id.toString(),
      receiverId._id.toString(),
      sender,
    );
  }

  @ApiCreateDoc({
    summary: 'Cancel friend request',
    description: 'Cancel a sent friend request',
    auth: true,
    response: Object,
  })
  @Post('cancel-request/:receiverId')
  cancelRequest(
    @Param('receiverId', ParseObjectIdPipe) receiverId: Types.ObjectId,
    @CurrentUser() sender: UserDocument,
  ) {
    return this.friendRequestService.cancelRequest(
      sender._id.toString(),
      receiverId._id.toString(),
    );
  }

  @ApiCreateDoc({
    summary: 'Accept friend request',
    description: 'Accept a received friend request',
    auth: true,
    response: Object,
  })
  @Post('accept-request/:userTorespond')
  acceptRequest(
    @Param('userTorespond', ParseObjectIdPipe) userTorespond: Types.ObjectId,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.friendRequestService.acceptRequest(
      currentUser._id.toString(),
      userTorespond._id.toString(),
      currentUser,
    );
  }

  @ApiCreateDoc({
    summary: 'Reject friend request',
    description: 'Reject a received friend request',
    auth: true,
    response: Object,
  })
  @Post('reject-request/:userTorespond')
  rejectRequest(
    @Param('userTorespond', ParseObjectIdPipe) userTorespond: Types.ObjectId,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.friendRequestService.rejectRequest(
      currentUser._id.toString(),
      userTorespond._id.toString(),
    );
  }

  @ApiGetManyDoc({
    summary: 'Get sent pending requests',
    description: 'Get list of sent friend requests that are still pending',
    auth: true,
    response: PendingSentRequestResponseDto,
    isArray: true,
  })
  @TransformDto(PendingSentRequestResponseDto)
  @Get('pending-request/sent')
  getSentPendingFriendRequest(@CurrentUser() currentUser: UserDocument) {
    return this.friendRequestService.getPendingFriendRequest(
      currentUser._id.toString(),
      IroleInRequest.SENDER,
    );
  }

  @ApiGetManyDoc({
    summary: 'Get received pending requests',
    description: 'Get list of received friend requests that are still pending',
    auth: true,
    response: PendingReceivedRequestResponseDto,
    isArray: true,
  })
  @TransformDto(PendingReceivedRequestResponseDto)
  @Get('pending-request/received')
  getRecievedPendingFriendRequest(@CurrentUser() currentUser: UserDocument) {
    return this.friendRequestService.getPendingFriendRequest(
      currentUser._id.toString(),
      IroleInRequest.RECEIVER,
    );
  }

  @ApiGetManyDoc({
    summary: 'Get friends list',
    description: 'Get list of accepted friends',
    auth: true,
    response: friendsListResponseDto,
    isArray: true,
    queries: [
      {
        name: 'search',
        type: String,
        required: false,
        description: 'Search term for friend names',
        example: 'john',
      },
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of friends to return',
        example: 10,
      },
      {
        name: 'offset',
        type: Number,
        required: false,
        description: 'Number of friends to skip',
        example: 0,
      },
    ],
  })
  @TransformDto(friendsListResponseDto)
  @Get('list')
  getFriends(
    @CurrentUser() currentUser: UserDocument,
    @Query() friendsQueryDto: FriendRequestQueryDto,
  ) {
    return this.friendRequestService.getFriends(
      currentUser._id.toString(),
      friendsQueryDto,
    );
  }
}

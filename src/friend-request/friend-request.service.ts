import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friend-request.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequestGateway } from './friend-request.gateway';
import { plainToInstance } from 'class-transformer';
import { FriendRequestResponseDto } from './dto/friend-request-reponse.dto';
import { NotificationService } from 'src/notification/notification.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import {
  NotificationModel,
  NotificationType,
} from 'src/notification/constants';
import { strictCursorPaginationResponse } from 'src/common/interface/pagination.interface';
import { FriendRequestQueryDto } from './dto/friend-request-query.dto';
import { paginatedFriendsList } from './interfaces/friend-request.interface';
import { Status_type } from './constant';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequest>,
    private readonly userService: UsersService,
    private readonly friendRequestGateway: FriendRequestGateway,
    private readonly notificationService: NotificationService,
  ) {}
  async sendFriendRequest(
    sender: string,
    receiver: string,
    currentUser: UserDocument,
  ) {
    //todos

    //stop user send reqwuest to self
    if (sender === receiver)
      throw new BadRequestException('Cannot send a request to yourself');

    //i want to check if a sender and the receiver exists

    //check for duplicates
    const existingfriendRequest = await this.friendRequestModel.findOne({
      $or: [
        {
          sender: sender,
          receiver: receiver,
        },
        {
          sender: receiver,
          receiver: sender,
        },
      ],
      status: { $in: ['pending', 'accept'] },
    });
    if (existingfriendRequest)
      throw new BadRequestException(
        `Request already sent : ${existingfriendRequest.status}`,
      );

    const friendRequest = await this.friendRequestModel.create({
      sender,
      receiver,
    });

    await friendRequest.populate([
      {
        path: 'sender',
        select: '_id name email avatar',
      },
      {
        path: 'receiver',
        select: '_id name email avatar',
      },
    ]);

    const friendRequestResponse = plainToInstance(
      FriendRequestResponseDto,
      friendRequest,
      {
        excludeExtraneousValues: true,
      },
    );

    this.friendRequestGateway.handleSendFriendRequest(
      receiver,
      friendRequestResponse,
    );
    void this.notificationService.createNotification({
      sender: currentUser,
      recipients: new Types.ObjectId(friendRequestResponse.receiverId),
      type: NotificationType.FRIEND_REQUEST_SENT,
      onModel: NotificationModel.FRIEND_REQUEST,
      targetResourceId: friendRequestResponse._id,
      metadata: {
        requestStatus: friendRequestResponse.status,
      },
    });

    return friendRequestResponse;
  }

  async cancelRequest(sender: string, receiver: string) {
    const existingfriendRequest = await this.friendRequestModel.findOne({
      sender,
      receiver,
      status: 'pending',
    });

    if (!existingfriendRequest)
      throw new BadRequestException('No Request to cancel');

    await existingfriendRequest.deleteOne();
    this.friendRequestGateway.handleCancelFriendRequest(
      receiver,
      existingfriendRequest.id.toString(),
    );
  }

  async acceptRequest(
    currentUserId: string,
    userToRespond: string,
    currentUser: UserDocument,
  ) {
    const existingfriendRequest = await this.friendRequestModel
      .findOne({
        sender: userToRespond,
        receiver: currentUserId,
        status: 'pending',
      })
      .populate('sender', '_id name email avatar')
      .populate('receiver', '_id name email avatar');

    if (!existingfriendRequest)
      throw new BadRequestException('No Request to accept');

    console.log(currentUserId, existingfriendRequest.sender._id.toString());

    if (currentUserId === existingfriendRequest.sender._id.toString())
      throw new BadRequestException('cannot accept your own request');

    existingfriendRequest.status = 'accept';
    await existingfriendRequest.save();

    await this.addFriendsToUser(currentUserId, userToRespond);

    const response = plainToInstance(
      FriendRequestResponseDto,
      existingfriendRequest,
      { excludeExtraneousValues: true },
    );

    this.friendRequestGateway.handleAcceptFriendRequest(
      userToRespond,
      response,
    );

    void this.notificationService.createNotification({
      sender: currentUser,
      recipients: new Types.ObjectId(response.senderId),
      type: NotificationType.FRIEND_REQUEST_ACCEPTED,
      onModel: NotificationModel.FRIEND_REQUEST,
      targetResourceId: response._id,
      metadata: {
        requestStatus: response.status,
      },
    });
  }

  async rejectRequest(currentUser: string, userToRespond: string) {
    const existingfriendRequest = await this.friendRequestModel
      .findOne({
        sender: userToRespond,
        receiver: currentUser,
        status: 'pending',
      })
      .populate('sender', '_id name email avatar')
      .populate('receiver', '_id name email avatar');

    if (!existingfriendRequest)
      throw new BadRequestException('No Request to reject');

    existingfriendRequest.status = 'reject';
    await existingfriendRequest.save();

    const response = plainToInstance(
      FriendRequestResponseDto,
      existingfriendRequest,
      { excludeExtraneousValues: true },
    );

    this.friendRequestGateway.handleRejectFriendRequest(
      userToRespond,
      response,
    );
  }

  async getPendingFriendRequest(
    currentUser: string,
    roleInRequest: 'sender' | 'receiver',
  ) {
    const pendingReqQuery = {
      status: 'pending',
    };

    pendingReqQuery[roleInRequest] = currentUser;
    const populateRole: 'sender' | 'receiver' =
      roleInRequest === 'sender' ? 'receiver' : 'sender';
    const pendingFriendRequest = await this.friendRequestModel
      .find(pendingReqQuery)
      .populate(populateRole, 'name _id email avatarUrl ')
      .lean();

    return pendingFriendRequest;
  }

  async getFriends(
    currentUserId: string,
    { limit, cursor, search, _id: friendId }: FriendRequestQueryDto,
  ): Promise<strictCursorPaginationResponse<paginatedFriendsList>> {
    //using aggregation
    // step one you can create a pipeline array that we can push different pipeline stages into

    const pipeline: PipelineStage[] = [
      {
        $match: {
          $or: [
            { sender: new Types.ObjectId(currentUserId) },
            { receiver: new Types.ObjectId(currentUserId) },
          ],
          status: Status_type.ACCEPTED,
        },
      },
    ];

    //After the filter join the user Data needed

    pipeline.push({
      $lookup: {
        from: 'users',
        let: { senId: '$sender', recId: '$receiver' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$_id', new Types.ObjectId(currentUserId)] },
                  {
                    $or: [
                      { $eq: ['$_id', '$$senId'] },
                      { $eq: ['$_id', '$$recId'] },
                    ],
                  },
                ],
              },
            },
          },
          { $project: { name: 1, avatar: 1, email: 1 } },
        ],
        as: 'friendDetails',
      },
    });

    //unwind the users data agregated
    pipeline.push({ $unwind: '$friendDetails' });

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'friendDetails.name': { $regex: search, $options: 'i' } },
            { 'friendDetails.email': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    if (cursor && friendId) {
      pipeline.push({
        $match: {
          $or: [
            { 'friendDetails.name': { $gt: cursor } },
            {
              'friendDetails._id': { $gt: new Types.ObjectId(friendId) },
              'friendDetails.name': cursor,
            },
          ],
        },
      });
    }

    //final sorting and limiting
    pipeline.push({
      $sort: { 'friendDetails.name': 1, 'friendDetails._id': 1 },
    });
    pipeline.push({
      $limit: limit + 1,
    });

    const friendsList =
      await this.friendRequestModel.aggregate<paginatedFriendsList>(pipeline);

    console.log(friendsList, 'this is the friendlist');

    const hasNextPage = friendsList.length > limit;
    const newFriendList = friendsList.slice(0, limit);
    const newCursor = hasNextPage
      ? newFriendList[newFriendList.length - 1].friendDetails.name
      : null;
    const newFriendId = hasNextPage
      ? newFriendList[newFriendList.length - 1].friendDetails._id
      : null;

    return {
      data: newFriendList,
      meta: {
        cursor: {
          friendId: newFriendId,
          name: newCursor,
        },
        hasNextPage,
      },
    };
  }

  private async addFriendsToUser(currentUser: string, userToRespond: string) {
    const senderObjectId = new Types.ObjectId(currentUser);
    const receiverObjectId = new Types.ObjectId(userToRespond);

    console.log(senderObjectId, receiverObjectId);
    const sender = await this.userService.findOne(currentUser);
    sender.friends?.push(receiverObjectId);
    void sender.save();

    const receiver = await this.userService.findOne(userToRespond);
    receiver.friends?.push(senderObjectId);
    void receiver.save();
  }

  private async removeFriendsFromUser(
    currentUser: string,
    userToRespond: string,
  ) {
    const senderObjectId = new Types.ObjectId(currentUser);
    const receiverObjectId = new Types.ObjectId(userToRespond);

    const sender = await this.userService.findOne(currentUser);
    sender.friends?.splice(sender.friends.indexOf(senderObjectId), 1);
    void sender.save();

    const receiver = await this.userService.findOne(currentUser);
    receiver.friends?.splice(receiver.friends.indexOf(receiverObjectId), 1);
    void receiver.save();
  }
}

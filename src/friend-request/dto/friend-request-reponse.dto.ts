import { Expose, Transform, Type } from 'class-transformer';
import {
  ObjectId,
  TransformUserObjectToString,
} from 'src/_cores/decorators/object-id.decorator';
import { ResponseDto } from 'src/auth/dto/response.dto';

export class FriendRequestResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('sender', '_id')
  senderId: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('sender', 'name')
  senderName: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('sender', 'avatar')
  senderAvatarUrl: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('receiver', '_id')
  receiverId: string;

  @Expose()
  @TransformUserObjectToString<receiverNestedField>('receiver', 'name')
  receiverName: string;

  @Expose()
  @TransformUserObjectToString<receiverNestedField>('receiver', 'avatar')
  receiverAvatarUrl: string;

  @Expose()
  status: IFriendRequestStatus;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.updatedAt?.toISOString())
  updatedAt: string;
}

export class PendingSentRequestResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @Type(() => ResponseDto)
  receiver: ResponseDto;

  @Expose()
  status: IFriendRequestStatus;
}
export class PendingReceivedRequestResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @Type(() => ResponseDto)
  sender: ResponseDto;

  @Expose()
  status: IFriendRequestStatus;
}

export class friendsListResponseDto {
  @Expose()
  @TransformUserObjectToString<senderNestedField>('friendDetails', '_id')
  friendId: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('friendDetails', 'name')
  friendName: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('friendDetails', 'email')
  friendEmail: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('friendDetails', 'avatar')
  friendAvatarUrl: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.updatedAt?.toISOString())
  updatedAt: string;
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ParticipantDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) =>
    obj?.avatar
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/v${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}`
      : '',
  )
  avaterUrl: string;
}
class MessageDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  text: string;

  @Expose()
  @ObjectId('sender')
  sender: string;
}

export class conversationDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];

  @Expose()
  isGroup: boolean;

  @Expose()
  @ObjectId('groupOwner')
  groupOwner: string;

  @Expose()
  groupName: string;

  @Expose()
  @Transform(({ obj }) =>
    obj?.groupAvatar
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.groupAvatar.resource_type}/upload/v${obj.groupAvatar.version}/${obj.groupAvatar.public_id}.${obj.groupAvatar.format}`
      : null,
  )
  groupAvatarUrl: string;

  @Expose()
  @Type(() => MessageDto)
  lastMessage: MessageDto;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  @Transform(({ obj }) => obj.updatedAt?.toISOString())
  updatedAt: string;
}

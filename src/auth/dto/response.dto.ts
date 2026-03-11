/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ResponseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  role: 'user' | 'admin';

  @Expose()
  bio: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  @Transform(({ obj }) =>
    obj?.avatar
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/v${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}`
      : '',
  )
  avatarUrl: string;

  @Expose()
  @Transform(({ obj }) =>
    obj?.coverPhoto
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.coverPhoto.resource_type}/upload/v${obj.coverPhoto.version}/${obj.coverPhoto.public_id}.${obj.coverPhoto.format}`
      : '',
  )
  coverPhotoUrl: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ value }) => value?.map((id: any) => id.toString()))
  friends: string[];

  @Expose()
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;
}

/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import { Expose, Transform, Type } from 'class-transformer';
import type { Iprivacy } from '../Schema/post.schema';
import {
  ObjectId,
  TransformMediaFilesObject,
} from 'src/_cores/decorators/object-id.decorator';

export class PostAuthorResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ value }) => value?.map((id: any) => id.toString())) // eslint-disable-line @typescript-eslint/no-unsafe-call
  friends: string[];
}

export class UploadMediaResponse {
  @Expose()
  @TransformMediaFilesObject('mediaFiles')
  mediaFiles: string[];

  //for extracting the public_id in frontend
  //str.split('/')[7].split('.')[0]
}

export class PostResponseDto {
  @Expose()
  content: string;

  @Expose()
  backgroundColor: string;

  @Expose()
  @Type(() => PostAuthorResponseDto)
  author: PostAuthorResponseDto;

  @Expose()
  @Transform(({ obj }) => {
    return obj.reactionCount instanceof Map
      ? Object.fromEntries(obj.reactionCount)
      : obj.reactionCount;
  })
  reactionCount: Record<IReactionType, number>;

  @Expose()
  @TransformMediaFilesObject('mediaFiles')
  mediaFiles: string[];

  @Expose()
  privacy: Iprivacy;

  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @Transform(({ obj }) => obj.createdAt?.toISOString()) // eslint-disable-line @typescript-eslint/no-unsafe-call
  createdAt: string;

  @Expose()
  @Transform(({ obj }) => obj.updatedAt?.toISOString()) // eslint-disable-line @typescript-eslint/no-unsafe-call
  updatedAt: string;
}

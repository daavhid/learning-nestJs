/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import { Expose, Transform, Type } from 'class-transformer';
import {
  ObjectId,
  TransformUserObjectToString,
} from 'src/_cores/decorators/object-id.decorator';

export class CommentResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  content: string;

  @Expose()
  @ObjectId('user')
  userId: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('user', 'name')
  username: string;

  @Expose()
  @ObjectId('post')
  postId: string;

  @Expose()
  @Transform(({ obj }) => obj?.post?.content)
  postContent: string;

  @Expose()
  @Transform(({ obj }) => obj?.post?.author._id)
  postAuthorId: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  @ObjectId('parentComment')
  parentComment: string | null;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('userToreply', '_id')
  userToReplyId: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('userToreply', 'name')
  userToreplyName: string;

  @Expose()
  @Type(() => CommentResponseDto)
  replies: CommentResponseDto;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Transform(({ obj }) => obj.updatedAt?.toISOString())
  updatedAt: string;
}

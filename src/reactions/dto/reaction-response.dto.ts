import { Expose } from 'class-transformer';
import {
  ObjectId,
  TransformUserObjectToString,
} from 'src/_cores/decorators/object-id.decorator';

export class ReactionResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @ObjectId('post')
  post: string;

  @Expose()
  @TransformUserObjectToString('user', '_id')
  userId: string;

  @Expose()
  @TransformUserObjectToString('user', 'name')
  userName: string;

  @Expose()
  @TransformUserObjectToString('user', 'avatar')
  userAvatar: string;

  @Expose()
  type: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProtectOtherUserGuard } from 'src/_cores/guards/user-protect.guard';
import { Comment, CommentSchema } from 'src/comments/schemas/comment.schema';
import { Post, PostSchema } from 'src/posts/Schema/post.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [ProtectOtherUserGuard],
  exports: [
    ProtectOtherUserGuard,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
})
export class ProctectUserModule {}

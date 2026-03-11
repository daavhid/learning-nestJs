import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './Schema/post.schema';
import { ProctectUserModule } from 'src/proctect-user/proctect-user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ReactionsModule } from 'src/reactions/reactions.module';
import { PostsGateway } from './posts.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    CloudinaryModule,
    ReactionsModule,
    ProctectUserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway],
  exports: [PostsService],
})
export class PostsModule {}

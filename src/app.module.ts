import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ProctectUserModule } from './proctect-user/proctect-user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { ConversationMemberModule } from './conversation-member/conversation-member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ProctectUserModule,
    CloudinaryModule,
    ReactionsModule,
    CommentsModule,
    FriendRequestModule,
    ConversationModule,
    MessageModule,
    NotificationModule,
    ConversationMemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

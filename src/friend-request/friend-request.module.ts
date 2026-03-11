import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { UsersModule } from 'src/users/users.module';
import { FriendRequestGateway } from './friend-request.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UsersModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestGateway],
})
export class FriendRequestModule {}

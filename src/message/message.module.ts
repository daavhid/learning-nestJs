import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageGateway } from './message.gateway';
import { MessageGuard } from './guards/message.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, MessageGuard],
})
export class MessageModule {}

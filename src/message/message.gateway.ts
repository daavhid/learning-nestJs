import { WebSocketGateway } from '@nestjs/websockets';
import { MessageResponseDto } from './dto/message-response.dto';
import { BaseAuthGateway, socketConfig } from 'src/auth/auth.gateway';


@WebSocketGateway(socketConfig)
export class MessageGateway extends BaseAuthGateway {
  handleSendMessage(responseMessageDto: MessageResponseDto) {
    console.log(responseMessageDto, responseMessageDto.conversationId);
    this.server
      .to(responseMessageDto.conversationId)
      .emit('new message', { data: responseMessageDto });
  }

  handleUpdateMessage(
    conversationId: string,
    updatedMessageDto: Record<string, any>,
  ) {
    this.server
      .to(conversationId)
      .emit('update message', { data: updatedMessageDto });
  }

  handleMarkMessageAsSeen(
    senderId: string,
    updatedSeenMessageDto: Record<string, any>,
  ) {
    console.log(senderId, updatedSeenMessageDto, 'marking as seen');
    this.server
      .to(senderId)
      .emit('message seen', { data: updatedSeenMessageDto });
  }

  handleDeleteMessage(conversationId: string, messageId: string) {
    this.server.to(conversationId).emit('delete message', { messageId });
  }

  handleDeleteMessageForMe(conversationId: string, messageId: string) {
    console.log(conversationId, messageId);
    this.server.to(conversationId).emit('delete message for me', { messageId });
  }
}

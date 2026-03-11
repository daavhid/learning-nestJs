import { WebSocketGateway } from '@nestjs/websockets';
import { BaseAuthGateway, socketConfig } from 'src/auth/auth.gateway';
import { FriendRequestResponseDto } from './dto/friend-request-reponse.dto';

@WebSocketGateway(socketConfig)
export class FriendRequestGateway extends BaseAuthGateway {
  handleSendFriendRequest(
    receiver: string,
    friendRequestResponse: FriendRequestResponseDto,
  ) {
    console.log(receiver, friendRequestResponse);
    this.server.to(receiver).emit('request sent', friendRequestResponse);
  }

  handleCancelFriendRequest(receiver: string, requestId: string) {
    console.log(receiver, requestId);
    this.server.to(receiver).emit('request canceled', { requestId });
  }

  handleAcceptFriendRequest(
    receiver: string,
    requestResponse: FriendRequestResponseDto,
  ) {
    console.log(receiver, requestResponse);
    this.server.to(receiver).emit('request accepted', requestResponse);
  }

  handleRejectFriendRequest(
    receiver: string,
    requestResponse: FriendRequestResponseDto,
  ) {
    console.log(receiver, requestResponse);
    this.server.to(receiver).emit('request rejected', requestResponse);
  }
}

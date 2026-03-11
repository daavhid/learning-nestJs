import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BaseAuthGateway, socketConfig } from 'src/auth/auth.gateway';
@WebSocketGateway(socketConfig)
export class ConversationGateway extends BaseAuthGateway {
  @SubscribeMessage('join conversation')
  handleMessage(client: Socket, payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log('', client.data.user, payload, client.rooms);

    void client.join(payload);
  }
}

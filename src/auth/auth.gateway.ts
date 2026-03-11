/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export const socketConfig = {
  cors: {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  },
};

@WebSocketGateway(socketConfig)
export class BaseAuthGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  constructor(private jwtService: JwtService) {}
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      });
      if (!payload) {
        client.disconnect();
        return;
      }

      client.data.user = payload;

      void client.join(payload.sub.toString());
    } catch {
      client.disconnect();
      throw new BadRequestException('An Error Occured');
    }
  }

  handleDisconnect(client: Socket) {
    console.log('client disconected', client.id);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseAuthGateway } from 'src/auth/auth.gateway';
import { CreateNotificationPayload } from './interface';
import { NotificationDocument } from './schemas/notification.schema';

@WebSocketGateway()
export class NotificationGateway extends BaseAuthGateway {
  handleSendNotification(
    notifications: any,
    { metadata, sender }: Partial<CreateNotificationPayload>,
  ) {
    notifications.forEach((notification) => {
      const payload = {
        _id: notification._id.toString(),
        type: notification.type,
        onModel: notification.onModel,
        targetResourceId: notification.targetResourceId.toString(),
        senderName: sender?.name,
        senderId: sender?._id.toString(),
        senderEmail: sender?.email,
        metadata,
      };
      console.log(
        payload,
        'this is the payload for =>',
        notification.recipient,
      );
      this.server
        .to(notification.recipient)
        .emit('notification_received', payload);
    });
  }

  handleupdateNotification(
    updatedNotification: NotificationDocument,
    { metadata }: Partial<CreateNotificationPayload>,
  ) {
    const payload = {
      type: updatedNotification.type,
      _id: updatedNotification._id.toString(),
      metadata,
    };
    this.server
      .to(updatedNotification.recipient.toString())
      .emit('notification_updated', payload);
  }
}

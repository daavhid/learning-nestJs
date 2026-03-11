import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateNotificationPayload } from './interface';
import { NotificationGateway } from './notification.gateway';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';
import { strictCursorPaginationResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notifcationModel: Model<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification({
    recipients,
    onModel,
    sender,
    targetResourceId,
    type,
    metadata,
  }: CreateNotificationPayload) {
    //check if recipients in payload is an array or single id

    const recipientsId = Array.isArray(recipients)
      ? recipients.map((id) => id.toString())
      : [recipients.toString()];

    if (recipientsId.length === 0) return;

    const notifications = recipientsId.map((recipientId) => ({
      sender: sender._id,
      type,
      targetResourceId,
      onModel,
      recipient: recipientId,
    }));

    try {
      const notificationsObj =
        await this.notifcationModel.insertMany(notifications);

      this.notificationGateway.handleSendNotification(notificationsObj, {
        metadata,
        sender,
      });
    } catch {
      throw new InternalServerErrorException('something happened');
    }
  }

  async updateNotification({
    sender,
    targetResourceId,
    type,
    metadata,
  }: CreateNotificationPayload) {
    const updatedNotification = await this.notifcationModel.findOneAndUpdate(
      {
        sender: sender._id,
        targetResourceId,
        type,
      },
      {
        isRead: false,
      },
    );

    if (!updatedNotification)
      throw new NotFoundException('notification not found');

    this.notificationGateway.handleupdateNotification(updatedNotification, {
      metadata,
    });
  }

  async getNotifications(
    currentUser: UserDocument,
    { cursor, limit, _id }: PaginationQueryDto,
  ): Promise<strictCursorPaginationResponse<Notification>> {
    const query: Record<string, any> = {
      recipient: currentUser._id,
    };
    if (cursor && _id) {
      query.$or = [
        { createdAt: { $lt: new Date(cursor) } },
        {
          _id: { $lt: _id },
          createdAt: new Date(cursor),
        },
      ];
    }
    const notifications = await this.notifcationModel
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasNextPage = notifications.length > limit;
    const newNotifications = notifications.slice(0, limit);
    const newCursor = hasNextPage
      ? newNotifications[newNotifications.length - 1].createdAt
      : null;
    const newId = hasNextPage
      ? newNotifications[newNotifications.length - 1]._id
      : null;

    return {
      data: newNotifications,
      meta: {
        cursor: {
          createdAt: newCursor,
          _id: newId,
        },
        hasNextPage: hasNextPage,
      },
    };
  }

  async markNotificationAsRead(id: string) {
    const notification = await this.notifcationModel.findByIdAndUpdate(
      id,
      {
        $set: { isRead: true },
      },
      { new: true },
    );
    if (!notification) throw new NotFoundException('Notification not found');

    return {
      message: 'success',
    };
  }

  async markAllAsRead(currentUser: UserDocument) {
    await this.notifcationModel.updateMany(
      {
        recipient: currentUser._id,
        isRead: false,
      },
      { isRead: true },
    );
  }

  async deleteNotification(id: string) {
    const notification = await this.notifcationModel.findByIdAndDelete(id);
    if (!notification) throw new NotFoundException('Notification not found');
  }
}

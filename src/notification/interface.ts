import { Types } from 'mongoose';
import { NotificationModel, NotificationType } from './constants';
import { UserDocument } from 'src/users/schemas/user.schema';

export interface CreateNotificationPayload {
  sender: UserDocument;
  recipients: Types.ObjectId | Types.ObjectId[];
  type: NotificationType;
  onModel: NotificationModel;
  targetResourceId: string;
  metadata?: Record<string, any>;
}

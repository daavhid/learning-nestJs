import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { NotificationModel, NotificationType } from '../constants';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId;

  @Prop({ enum: NotificationType, type: String })
  type: NotificationType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'OnModel' })
  targetResourceId: Types.ObjectId;

  @Prop({ enum: NotificationModel, type: String })
  onModel: NotificationModel;

  @Prop({ default: false })
  isRead: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipient: 1, createdAt: 1, _id: 1 });

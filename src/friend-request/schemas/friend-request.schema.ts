import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { STATUS_TYPE_ARRAY } from '../constant';

export type FriendRequestDocument = HydratedDocument<FriendRequest>;

@Schema({ timestamps: true })
export class FriendRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: mongoose.Types.ObjectId;

  @Prop({ enum: STATUS_TYPE_ARRAY, default: 'pending' })
  status: IFriendRequestStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);

FriendRequestSchema.index({ sender: 1, receiver: 1 });

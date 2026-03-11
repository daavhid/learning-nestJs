import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Mediatype } from 'src/posts/Schema/post.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  memberCount: number;

  @Prop()
  memberHash?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  groupOwner?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;

  @Prop()
  lastMessageAt?: Date;

  @Prop()
  groupAvatar?: Mediatype;

  @Prop()
  groupName?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

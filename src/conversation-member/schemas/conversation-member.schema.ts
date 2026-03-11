import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import type { MessageDocument } from 'src/message/schemas/message.schema';

export type ConversationMemberDoc = HydratedDocument<ConversationMember>;

@Schema({ timestamps: true })
export class ConversationMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  conversationLastMessageAt?: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  conversationLastMessage?: MessageDocument;

  @Prop()
  lastReadMessageAt?: Date;

  @Prop({ enum: ['admin', 'member', 'readonly'], default: 'member' })
  role?: string;

  @Prop()
  lastSeen?: Date;

  @Prop({ default: false })
  isBanned?: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}

export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember);

ConversationMemberSchema.index(
  { userId: 1, conversationId: 1 },
  { unique: true },
);

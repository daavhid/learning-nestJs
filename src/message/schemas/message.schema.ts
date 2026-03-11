import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import type { ConversationDocument } from 'src/conversation/schemas/conversation.schema';
import { Mediatype } from 'src/posts/Schema/post.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversationId: ConversationDocument | Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ default: [] })
  mediaFiles?: Mediatype[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  deletedFor: Types.ObjectId[];

  @Prop({ default: false })
  deletedForEveryone: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import type { UserDocument } from 'src/users/schemas/user.schema';

export type PostDocument = HydratedDocument<
  Post & {
    createdAt: Date;
    updatedAt: Date;
  }
>;

export type Iprivacy = 'public' | 'private' | 'friends';

export class Mediatype {
  version: number;
  public_id: string;
  format: string;
  resource_type: string;
  display_name: string;
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ default: '#fff' })
  backgroundColor: string;

  @Prop()
  content: string;

  @Prop({ default: [] })
  mediaFiles?: Mediatype[];

  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  privacy: Iprivacy;

  @Prop({ default: {} })
  reactionCount: Map<IReactionType, number>;

  createdAt: Date;
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

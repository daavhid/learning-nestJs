import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { REACTION_TYPE_ARRAY } from '../constants';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: mongoose.Types.ObjectId;

  @Prop({ enum: REACTION_TYPE_ARRAY, default: 'like' })
  type: IReactionType;

  createdAt: Date;

  updatedAt: Date;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

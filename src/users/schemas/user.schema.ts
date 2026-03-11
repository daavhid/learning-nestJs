import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Mediatype } from 'src/posts/Schema/post.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'user' })
  role: 'user' | 'admin';

  @Prop()
  bio?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  phoneNumber?: string;

  @Prop()
  avatar?: Mediatype;

  @Prop()
  coverPhoto?: Mediatype;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  friends?: mongoose.Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

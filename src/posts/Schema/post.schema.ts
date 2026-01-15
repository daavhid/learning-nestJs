import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>

export type Iprivacy = 'public' | 'private' | 'friends'

@Schema({timestamps: true})
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author:mongoose.Types.ObjectId
    
    @Prop({default:'#fff'})
    backgroundColor:string

    @Prop()
    content:string;

    @Prop()
    mediaUrls?:string[]

    @Prop({enum:['public','private','friends'],default:'public'})
    privacy:Iprivacy


}

export const PostSchema = SchemaFactory.createForClass(Post)

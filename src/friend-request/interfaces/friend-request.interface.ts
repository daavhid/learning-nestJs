import { Types } from 'mongoose';
import { Mediatype } from 'src/posts/Schema/post.schema';

export enum IroleInRequest {
  SENDER = 'sender',
  RECEIVER = 'receiver',
}

interface IFriendDetails {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar: Mediatype;
}

export interface paginatedFriendsList {
  _id: Types.ObjectId;
  friendDetails: IFriendDetails;
  status: IFriendRequestStatus;
  createdAt: Date;
}

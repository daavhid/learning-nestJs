import { Expose, Transform, Type } from 'class-transformer';
import {
  ObjectId,
  TransformMediaFilesObject,
  TransformUserObjectToString,
} from 'src/_cores/decorators/object-id.decorator';
import { ParticipantDto } from 'src/conversation/dto/conversation-response.dto';

export class MessageResponseDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @ObjectId('conversationId')
  conversationId: string;

  @Expose()
  text: string;

  @Expose()
  @TransformUserObjectToString('sender', '_id')
  senderId: string;

  @Expose()
  @TransformUserObjectToString('sender', 'name')
  senderName: string;

  // avatar may not always exist
  @Expose()
  @TransformUserObjectToString('sender', 'avatar')
  senderAvatarUrl?: string;

  @Expose()
  @TransformMediaFilesObject('mediaFiles')
  mediaFiles: string[];

  @Expose()
  deletedForEveryone: boolean;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.createdAt?.toISOString())
  createdAt: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj.updatedAt?.toISOString())
  updatedAt: string;
}

export class updatedMessageDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  text: string;

  @Expose()
  @TransformMediaFilesObject('mediaFiles')
  mediaFiles: string[];
}

export class memberWhoReadMessageDto {
  @Expose()
  @TransformUserObjectToString<senderNestedField>('userId', '_id')
  viewerId: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('userId', 'name')
  viewerName: string;

  @Expose()
  @TransformUserObjectToString<senderNestedField>('userId', 'avatar')
  viewerAvatarUrl: string;

  @Expose()
  @Type(() => Date)
  lastReadMessageAt: string;
}

export class updatedSeenMessageDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @Type(() => ParticipantDto)
  seenBy: ParticipantDto;
}

// {
//     "data": [
//         {
//             "_id": "698e853ad76890050487487d",
//             "conversationId": "698e6e95e7da8d3b5c19d61c",
//             "sender": "6980e2eb4fd24495d7755f01",
//             "text": "hola david",
//             "mediaFiles": [],
//             "isSeenBy": [],
//             "deletedFor": [
//                 "6980e2eb4fd24495d7755f01"
//             ],
//             "deletedForEveryone": false,
//             "createdAt": "2026-02-13T01:58:18.032Z",
//             "updatedAt": "2026-02-13T02:02:56.553Z",
//             "__v": 1
//         },
//         {
//             "_id": "698e7ff45b4ceed64f4a6c6b",
//             "conversationId": "698e6e95e7da8d3b5c19d61c",
//             "sender": "6980e2eb4fd24495d7755f01",
//             "text": "The guy too good man😁",
//             "mediaFiles": [],
//             "isSeenBy": [],
//             "deletedFor": [
//                 "6980e2eb4fd24495d7755f01"
//             ],
//             "deletedForEveryone": false,
//             "createdAt": "2026-02-13T01:35:48.447Z",
//             "updatedAt": "2026-02-13T01:41:59.876Z",
//             "__v": 2
//         }
//     ],
//     "meta": {
//         "cursor": null,
//         "hasNextPage": false
//     }
// }

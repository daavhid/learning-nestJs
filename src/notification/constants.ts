// notification.constants.ts

export enum NotificationType {
  // Social: Friendships
  FRIEND_REQUEST_SENT = 'FRIEND_REQUEST_SENT',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',

  //Messages
  NEW_MESSAGE_SENT = 'NEW_MESSAGE_SENT',

  // Content: Posts
  POST_CREATED = 'POST_CREATED',
  POST_REACTED = 'POST_REACTED',
  POST_SHARED = 'POST_SHARED',
  POST_MENTION = 'POST_MENTION', // When someone @tags you in a post

  // Content: Comments
  COMMENT_ADDED = 'COMMENT_ADDED',
  COMMENT_REPLY = 'COMMENT_REPLY',
  COMMENT_LIKED = 'COMMENT_LIKED',

  // System & Account
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  ACCOUNT_SECURITY = 'ACCOUNT_SECURITY', // e.g., Login from new device
}

export enum NotificationModel {
  USER = 'User',
  POST = 'Post',
  COMMENT = 'Comment',
  FRIEND_REQUEST = 'FriendRequest',
  CONVERSATION = 'Conversation',
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model, Types } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentsGateway } from './comments.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationPayload } from 'src/notification/interface';
import {
  NotificationModel,
  NotificationType,
} from 'src/notification/constants';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly userService: UsersService,
    private readonly postsService: PostsService,
    private readonly commentGateway: CommentsGateway,
    private readonly notificationService: NotificationService,
  ) {}
  async create(
    { postId, directParentCommentId, content, replytoUserId }: CreateCommentDto,
    currentUserId: string,
    currentUser: UserDocument,
  ) {
    const post = await this.postsService.findOnePost(postId);

    let userToReply: UserDocument | null = null;
    let parentCommentId: Types.ObjectId | null = null;
    let directparentcommentContent: string | null = null;

    if (replytoUserId) {
      userToReply = await this.userService.findOne(replytoUserId);
      const userToreplyComment = await this.commentModel.findById(
        directParentCommentId,
      );
      console.log(
        userToreplyComment,
        userToReply,
        ' this is the next name of the guy',
      );
      if (userToReply?._id.toString() !== userToreplyComment?.user.toString()) {
        throw new BadRequestException(
          'user to reply has no comment on the post ',
        );
      }
    }
    if (directParentCommentId) {
      const directcommentParent = await this.findOne(directParentCommentId);
      directparentcommentContent = directcommentParent.content;
      parentCommentId = directcommentParent?.parentComment?._id
        ? directcommentParent.parentComment._id
        : directcommentParent._id;
    }

    const newComment = await (
      await this.commentModel.create({
        post: post._id.toString(),
        user: currentUserId,
        content,
        userToreply: userToReply?._id,
        parentComment: parentCommentId,
      })
    ).populate([
      {
        path: 'userToreply',
        select: '_id name',
      },
      {
        path: 'post',
        select: '_id content author',
      },
      {
        path: 'user',
        select: '_id name',
      },
      {
        path: 'parentComment',
        select: '_id content',
      },
    ]);

    const newCommentResponse = plainToInstance(
      CommentResponseDto,
      { ...newComment.toObject(), replies: [] },
      { excludeExtraneousValues: true },
    );

    this.commentGateway.handleCreateComment(postId, newCommentResponse);

    const commentNotification: CreateNotificationPayload = {
      type: NotificationType.COMMENT_ADDED,
      onModel: NotificationModel.COMMENT,
      recipients: newCommentResponse.userToReplyId
        ? new Types.ObjectId(newCommentResponse.userToReplyId)
        : new Types.ObjectId(newCommentResponse.postAuthorId),
      sender: currentUser,
      targetResourceId: newCommentResponse.postId,
      metadata: {
        commentId: newCommentResponse._id,
        content: newCommentResponse.content.substring(0, 50),
        postPreview: newCommentResponse.postContent,
        parentText: directparentcommentContent,
      },
    };
    if (
      commentNotification.recipients.toString() !==
      commentNotification.sender._id.toString()
    ) {
      await this.notificationService.createNotification(commentNotification);
    }

    return {
      message: 'successful',
      data: newCommentResponse,
    };
  }

  async getCommentsForPost(postId: string) {
    const post = await this.postsService.findOnePost(postId);
    const comments = await this.commentModel
      .find({
        post: post._id.toString(),
      })
      .populate('post')
      .populate('user')
      .populate('parentComment')
      .populate('userToreply')
      .lean();

    const repliesObject: Record<string, Comment[]> = {};
    const newComments: any[] = [];

    for (const comment of comments) {
      const id = comment._id.toString();
      const parentId = comment?.parentComment?._id.toString() ?? null;

      repliesObject[id] ??= [];

      if (parentId) {
        (repliesObject[parentId] ??= []).push(comment);
      } else {
        newComments.push({
          ...comment,
          replies: repliesObject[id],
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return newComments;
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('comment not found');

    return comment;
  }

  async findOneAndUpdate(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(
      id,
      updateCommentDto,
      { new: true },
    );

    if (!comment) throw new NotFoundException('Comment not found');

    this.commentGateway.handleUpdateComment(
      comment.post!._id.toString(),
      id,
      comment,
    );

    return {
      message: 'success',
      comment,
    };
  }

  async findcommentAndDelete(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (!comment.parentComment) {
      await this.commentModel.deleteMany({
        parentComment: comment._id.toString(),
      });
    }

    this.commentGateway.handleDeleteComment(
      comment.post!.toString(),
      comment._id.toString(),
    );

    return {
      message: 'success',
    };
  }
}

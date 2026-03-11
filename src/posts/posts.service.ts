import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UploadMediaUrlsDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './Schema/post.schema';
import { Model, Types } from 'mongoose';
import { PostQueryDto } from './dto/post-query.dto';
import { cursorPaginationResponse } from 'src/common/interface/pagination.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { CreateReactionDto } from 'src/reactions/dto/create-reaction.dto';
import { ReactionsService } from 'src/reactions/reactions.service';
import { RemoveReactionDto } from 'src/reactions/dto/remove-reaction.dto';
import { Comment } from 'src/comments/schemas/comment.schema';
import { PostsGateway } from './posts.gateway';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto, UploadMediaResponse } from './dto/post-response.dto';
import { ReactionResponseDto } from 'src/reactions/dto/reaction-response.dto';
import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationPayload } from 'src/notification/interface';
import {
  NotificationModel,
  NotificationType,
} from 'src/notification/constants';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly reactionService: ReactionsService,
    private readonly postGateway: PostsGateway,
    private readonly notificationService: NotificationService,
  ) {}
  async createPost(createPostDto: CreatePostDto, userId: string) {
    const newPost = await this.postModel.create({
      ...createPostDto,
      author: { _id: new Types.ObjectId(userId) },
    });
    await newPost.populate('author', '_id name email avatar friends');

    const postResponse = plainToInstance(PostResponseDto, newPost, {
      excludeExtraneousValues: true,
    });

    const postNotification: CreateNotificationPayload = {
      sender: newPost.author,
      recipients: newPost.author.friends!,
      onModel: NotificationModel.POST,
      targetResourceId: newPost._id.toString(),
      type: NotificationType.POST_CREATED,
      metadata: {
        content: newPost.content.substring(0, 60),
      },
    };

    await this.notificationService.createNotification(postNotification);

    this.postGateway.handlePostCreated(postResponse);

    return newPost;
  }

  async findAllPost({
    limit,
    cursor,
  }: PostQueryDto): Promise<cursorPaginationResponse<PostDocument>> {
    //implement cursor pagination

    // if(page) {

    //   const skip = (page -1 ) * limit
    //   console.log(skip)

    //   let filter:any = {}

    //   if(search){
    //     filter.content = {$regex:search,$options:'i'}
    //   }

    //   const [data,total] = await  Promise.all([
    //     this.postModel.find(filter)
    //     .sort({ createdAt: -1 })
    //     .skip(skip)
    //     .limit(limit)
    //     .populate('author')

    //   .exec(),

    //   this.postModel.countDocuments(filter)
    //   ])

    //   return {
    //     data:data,
    //     meta:{
    //       currentPage:page,
    //       pageSize:limit,
    //       totalItems:total,
    //       totalPages:Math.ceil(total / limit),
    //       hasNextPage : page < Math.ceil(total / limit),
    //       hasPreviousPage:page > 1
    //     }
    //   }
    // }

    const postsData = await this.postModel
      .find({
        createdAt: { $lt: cursor ? new Date(cursor) : new Date() },
      })
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .exec();

    const hasNextPage = postsData.length === limit + 1;
    const newPostsData = postsData.slice(0, limit);
    const newCursor = hasNextPage
      ? newPostsData[newPostsData.length - 1].createdAt
      : null;

    return {
      data: newPostsData,
      meta: {
        cursor: newCursor?.toISOString() as string | null,
        hasNextPage,
      },
    };
  }

  async findOnePost(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found ');

    return post;
  }

  async findOnePostWithReaction(id: string, userId: string) {
    const post = await this.postModel.findById(id).lean();
    if (!post) throw new NotFoundException('Post not found ');

    const existingReaction = await this.reactionService.findExistingReaction(
      id,
      userId,
    );

    return {
      ...post,
      reaction: existingReaction?.type,
    };
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author');

    if (!post) throw new NotFoundException('Post not found');

    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });

    this.postGateway.handlePostUpdated(postResponse, updatePostDto);

    return post;
  }

  async uploadMedia(id: string, uploadMediaUrlDto: UploadMediaUrlsDto) {
    console.log(uploadMediaUrlDto);
    const post = await this.postModel.findById(id).populate('author');
    if (!post) throw new NotFoundException('Post not found');
    if (uploadMediaUrlDto && uploadMediaUrlDto.media.length > 0) {
      uploadMediaUrlDto.media.forEach((media) => {
        post.mediaFiles?.push(media);
      });
    }

    await post.save();

    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
    const mediaFilesResponse = plainToInstance(UploadMediaResponse, post, {
      excludeExtraneousValues: true,
    });

    this.postGateway.handleUploadMediaToPost(postResponse, mediaFilesResponse);

    return {
      message: 'Media uploaded successfully',
      data: mediaFilesResponse,
    };
  }

  async removeMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    post.mediaFiles = post.mediaFiles?.filter(
      (mediaFile) => mediaFile.public_id !== deleteMediaDto.mediaId,
    );
    const deleted = await this.cloudinaryService.deleteFile(
      deleteMediaDto.mediaId,
    );
    if (!deleted) throw new BadRequestException('file could not be deleted');

    await post.save();
    const postResponse = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
    this.postGateway.handleDeleteMediaFromPost(postResponse, deleteMediaDto);
  }

  async addReactionToPost(
    { type, postId }: CreateReactionDto,
    user: UserDocument,
  ) {
    const post = await this.postModel
      .findById(postId)
      .populate('author', 'name _id email');
    if (!post) throw new NotFoundException('Post not found');

    const typeReactionCount = this.getReactionCountFromPost(type, post);
    console.log(typeReactionCount, type);

    //get existing reaction for that post if there is
    const existingReaction = await this.reactionService.findExistingReaction(
      postId,
      user._id.toString(),
    );

    if (existingReaction) {
      const isReactionSimilar = existingReaction?.type === type;
      if (isReactionSimilar) return;
      const existingReactionCount = this.getReactionCountFromPost(
        existingReaction?.type,
        post,
      );
      if (existingReactionCount - 1 !== 0) {
        post.reactionCount.set(
          existingReaction?.type,
          existingReactionCount - 1,
        );
      } else {
        post.reactionCount.delete(existingReaction?.type);
      }
      post.reactionCount.set(type, typeReactionCount + 1);
      await post.save();
      const newReaction = await (
        await this.reactionService.updateReaction(
          { type, postId },
          user._id.toString(),
        )
      )?.populate('user');

      const reactionResponse = plainToInstance(
        ReactionResponseDto,
        newReaction,
        { excludeExtraneousValues: true },
      );

      this.postGateway.handleUpdateReaction(
        reactionResponse,
        post.reactionCount,
      );
      const reactionNotification: CreateNotificationPayload = {
        sender: user,
        recipients: post.author._id,
        type: NotificationType.POST_REACTED,
        onModel: NotificationModel.POST,
        targetResourceId: post._id.toString(),
        metadata: {
          reactionType: reactionResponse.type,
          reactionId: reactionResponse._id,
        },
      };

      if (
        reactionNotification.recipients.toString() !==
        reactionNotification.sender._id.toString()
      ) {
        await this.notificationService.updateNotification(reactionNotification);
      }

      return {
        message: 'reaction updated',
        data: reactionResponse,
        reactionCount: post.reactionCount,
      };

      //TODO:  EMIT EVENTS TO OTHER USERS
    } else {
      const newReaction = await (
        await this.reactionService.addReaction(
          { type, postId },
          user._id.toString(),
        )
      ).populate('user');

      post.reactionCount.set(type, typeReactionCount + 1);

      await post.save();

      const reactionResponse = plainToInstance(
        ReactionResponseDto,
        newReaction,
        { excludeExtraneousValues: true },
      );

      this.postGateway.handleAddReaction(reactionResponse, post.reactionCount);
      const reactionNotification: CreateNotificationPayload = {
        sender: user,
        recipients: post.author._id,
        type: NotificationType.POST_REACTED,
        onModel: NotificationModel.POST,
        targetResourceId: post._id.toString(),
        metadata: {
          reactionType: reactionResponse.type,
          reactionId: reactionResponse._id,
        },
      };

      if (
        reactionNotification.recipients.toString() !==
        reactionNotification.sender._id.toString()
      ) {
        await this.notificationService.createNotification(reactionNotification);
      }

      return {
        message: 'reaction added',
        data: reactionResponse,
        reactionCount: post.reactionCount,
      };
    }
  }

  async getPostReactions(postId: string) {
    const reactions = await this.reactionService.getPostReactions(postId);
    return reactions;
  }

  async removeReactionFromPost({ postId }: RemoveReactionDto, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const existingReaction = await this.reactionService.findExistingReaction(
      postId,
      userId,
    );

    if (!existingReaction)
      throw new BadRequestException('No Reaction found for this post');

    await this.reactionService.removeReaction(postId, userId);

    const existingReactionCount = this.getReactionCountFromPost(
      existingReaction?.type,
      post,
    );
    if (existingReactionCount - 1 !== 0) {
      post.reactionCount.set(existingReaction?.type, existingReactionCount - 1);
    } else {
      post.reactionCount.delete(existingReaction?.type);
    }
    await post.save();
    const reactionResponse = plainToInstance(
      ReactionResponseDto,
      existingReaction,
      { excludeExtraneousValues: true },
    );

    //TODO:  EMIT EVENTS TO OTHER USERS
    this.postGateway.handleRemoveReaction(reactionResponse, post.reactionCount);
  }

  async removePost(id: string) {
    const post = await this.postModel.findByIdAndDelete(id, { new: true });
    if (!post) throw new NotFoundException('Post not found');

    this.postGateway.handleRemovePost(post._id.toString());
  }

  private getReactionCountFromPost(
    type: IReactionType,
    post: PostDocument,
  ): number {
    if (post.reactionCount.has(type)) return post.reactionCount.get(type)!;
    return 0;
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestWithUser } from '../decorators/current-user.decorator';
import { Reflector } from '@nestjs/core';
import { Route_Key } from '../decorators/route.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/comments/schemas/comment.schema';
import { Post } from 'src/posts/Schema/post.schema';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProtectOtherUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const route = this.reflector.getAllAndOverride(Route_Key, [
      context.getClass(),
      context.getHandler(),
    ]);

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    const access = await this.FetchAccessToResource(
      route,
      context,
      this.getRouteService(route),
    );

    console.log(access, user.role !== 'admin', user);
    if (!access) {
      throw new ForbiddenException(
        'You cannot access a resource that is not yours',
      );
    }
    return true;
  }

  private getRouteService(route: string) {
    switch (route) {
      case 'post':
        return this.postModel;

      case 'comment':
        return this.commentModel;

      default:
        return null;
    }
  }
  private async FetchAccessToResource(
    route: string,
    context: ExecutionContext,
    services: Model<Post> | Model<Comment> | null,
  ) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;
    switch (route) {
      case 'user':
        return (
          user._id.toString() === request.params.id || user.role === 'admin'
        );
      case 'comment': {
        const commentService = services as Model<Comment>;
        const comment = await commentService.findById(request.params.commentId);
        if (!comment) throw new NotFoundException('Comment Not Found');
        const userId = comment.user._id.toString();
        return userId === user._id.toString() || user.role === 'admin';
      }
      case 'post': {
        const postService = services as Model<Post>;
        const post = await postService.findById(request.params.id);
        if (!post) throw new NotFoundException('Post Not Found');
        const authorId = post.author._id.toString();
        console.log('this is author id', authorId);
        return authorId === user._id.toString() || user.role === 'admin';
      }
      default:
        return true;
    }
  }
}

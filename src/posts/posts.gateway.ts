import { WebSocketGateway } from '@nestjs/websockets';
import { BaseAuthGateway, socketConfig } from 'src/auth/auth.gateway';
import { PostResponseDto, UploadMediaResponse } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { ReactionResponseDto } from 'src/reactions/dto/reaction-response.dto';

@WebSocketGateway(socketConfig)
export class PostsGateway extends BaseAuthGateway {
  handlePostCreated(data: PostResponseDto) {
    if (data.privacy === 'friends' || data.privacy === 'public') {
      this.server.to(data.author.friends).emit('post created', data);
    }
    this.server.to(data.author._id).emit('post created', data);
    this.server.to(data.author.friends).emit('post created notification');
  }

  handlePostUpdated(data: PostResponseDto, updatePostDto: UpdatePostDto) {
    this.server
      .to(this.postRoom(data._id))
      .emit('post updated', { postId: data._id, updatePostDto });
  }

  handleUploadMediaToPost(
    data: PostResponseDto,
    { mediaFiles }: UploadMediaResponse,
  ) {
    //
    this.server
      .to(this.postRoom(data._id))
      .emit('media uploaded', { postId: data._id, mediaFiles });
  }

  handleDeleteMediaFromPost(data: PostResponseDto, mediaId: DeleteMediaDto) {
    this.server
      .to(this.postRoom(data._id))
      .emit('media deleted', { postId: data._id, mediaId });
  }

  handleAddReaction(
    reaction: ReactionResponseDto,
    reactionCount: Map<IReactionType, number>,
  ) {
    console.log(reaction, reactionCount);
    this.server
      .to(this.postRoom(reaction.post))
      .emit('add reaction', { reaction, reactionCount });
  }

  handleUpdateReaction(
    reaction: ReactionResponseDto,
    reactionCount: Map<IReactionType, number>,
  ) {
    console.log(reaction, reactionCount, reaction.post, 'update reaction');
    this.server
      .to(this.postRoom(reaction.post))
      .emit('update reaction', { reaction, reactionCount });
  }

  handleRemoveReaction(
    reaction: ReactionResponseDto,
    reactionCount: Map<IReactionType, number>,
  ) {
    this.server
      .to(this.postRoom(reaction.post))
      .emit('remove reaction', { reactionId: reaction._id, reactionCount });
  }

  handleRemovePost(postId: string) {
    this.server.to(this.postRoom(postId)).emit('post deleted', { postId });
  }

  private postRoom(roomId: string) {
    return `post:${roomId}`;
  }
}

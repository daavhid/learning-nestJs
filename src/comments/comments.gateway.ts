import { WebSocketGateway } from '@nestjs/websockets';
import { BaseAuthGateway } from 'src/auth/auth.gateway';
import { CommentResponseDto } from './dto/comment-response.dto';
import { Comment } from './schemas/comment.schema';

@WebSocketGateway()
export class CommentsGateway extends BaseAuthGateway {
  handleCreateComment(postId: string, comment: CommentResponseDto) {
    this.server.to(postId).emit('comment created', { comment });
  }

  handleUpdateComment(
    postId: string,
    commentId: string,
    updateCommentDto: Comment,
  ) {
    console.log(postId, updateCommentDto, commentId);
    this.server.to(postId).emit('comment updated', {
      content: updateCommentDto.content,
      commentId,
      updatedAt: updateCommentDto.updatedAt.toISOString(),
    });
  }

  handleDeleteComment(postId: string, commentId: string) {
    this.server.to(postId).emit('comment deleted', { commentId });
  }
}

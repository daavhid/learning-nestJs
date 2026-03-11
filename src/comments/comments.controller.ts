import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { CommentResponseDto } from './dto/comment-response.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Routes } from 'src/_cores/decorators/route.decorator';
import { ProtectOtherUserGuard } from 'src/_cores/guards/user-protect.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateDoc,
  ApiGetManyDoc,
  ApiUpdateDoc,
  ApiDeleteDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('comments')
@Routes('comment')
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiGetManyDoc({
    summary: 'Get comments for a post',
    description: 'Retrieve all comments for a specific post',
    auth: true,
    response: CommentResponseDto,
    isArray: true,
    params: [
      {
        name: 'postId',
        description: 'The ID of the post',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @TransformDto(CommentResponseDto)
  @Get('posts/:postId')
  getCommentsForPost(@Param('postId', ParseObjectIdPipe) postId: string) {
    return this.commentsService.getCommentsForPost(postId);
  }

  @ApiCreateDoc({
    summary: 'Create a new comment',
    description: 'Add a comment to a post',
    auth: true,
    body: CreateCommentDto,
    response: CommentResponseDto,
  })
  @Post()
  addCommentToPost(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.commentsService.create(
      createCommentDto,
      currentUser._id.toString(),
      currentUser,
    );
  }

  @ApiUpdateDoc({
    summary: 'Update a comment',
    description: 'Update an existing comment',
    auth: true,
    body: UpdateCommentDto,
    response: CommentResponseDto,
    params: [
      {
        name: 'commentId',
        description: 'The ID of the comment to update',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @UseGuards(ProtectOtherUserGuard)
  @Patch('/:commentId')
  updateComment(
    @Param('commentId', ParseObjectIdPipe) commentId: Types.ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    console.log(commentId);
    return this.commentsService.findOneAndUpdate(
      commentId._id.toString(),
      updateCommentDto,
    );
  }

  @ApiDeleteDoc({
    summary: 'Delete a comment',
    description: 'Delete an existing comment',
    auth: true,
    params: [
      {
        name: 'commentId',
        description: 'The ID of the comment to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Routes('comment')
  @UseGuards(ProtectOtherUserGuard)
  @Delete('/:commentId')
  deleteComment(@Param('commentId', ParseObjectIdPipe) commentId: string) {
    return this.commentsService.findcommentAndDelete(commentId);
  }
}

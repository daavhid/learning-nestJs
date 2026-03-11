import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UploadMediaUrlsDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { TransformPostResponse } from 'src/_cores/interceptors/post-response.interceptor';
import { PostResponseDto } from './dto/post-response.dto';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { PostQueryDto } from './dto/post-query.dto';
import { Routes } from 'src/_cores/decorators/route.decorator';
import { ProtectOtherUserGuard } from 'src/_cores/guards/user-protect.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { RolesGuard } from 'src/_cores/guards/role.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { CreateReactionDto } from 'src/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from 'src/reactions/dto/remove-reaction.dto';
import { ReactionResponseDto } from 'src/reactions/dto/reaction-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  ApiCreateDoc,
  ApiDeleteDoc,
  ApiGetManyDoc,
  ApiGetOneDoc,
  ApiUpdateDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('posts')
@ApiBearerAuth('JWT-auth')
@Routes('post')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @TransformDto(PostResponseDto)
  @Post()
  @ApiCreateDoc({
    summary: 'Create new Post',
    description: 'Post created',
    response: PostResponseDto,
    body: CreatePostDto,
  })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.postsService.createPost(
      createPostDto,
      currentUser._id.toString(),
    );
  }

  @TransformPostResponse(PostResponseDto)
  @Get()
  @ApiGetManyDoc({
    summary: 'Get All Post',
    response: PostResponseDto,
    description: 'Post Retrieved Successfully',
    isArray: true,
  })
  findAllPost(@Query() postQueryDto: PostQueryDto) {
    return this.postsService.findAllPost(postQueryDto);
  }

  @TransformDto(PostResponseDto)
  @Get(':id')
  @ApiGetOneDoc({
    summary: 'Get One Post',
    params: [{ name: 'id', description: 'Post ID' }],
  })
  findOnePost(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.postsService.findOnePostWithReaction(
      id,
      currentUser._id.toString(),
    );
  }

  @UseGuards(ProtectOtherUserGuard)
  @TransformDto(PostResponseDto)
  @Patch(':id')
  @ApiUpdateDoc({
    summary: 'Update Post',
    params: [{ name: 'id', description: 'Post ID' }],
    response: PostResponseDto,
    body: UpdatePostDto,
    description: 'Post Updated',
  })
  @ApiOperation({ summary: 'Update post ' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  updatePost(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Post('reaction')
  @ApiCreateDoc({
    summary: 'Add reaction to post',
    body: CreateReactionDto,
    description: 'Reaction added to Post',
  })
  addReactionToPost(
    @CurrentUser() currentUser: UserDocument,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.postsService.addReactionToPost(createReactionDto, currentUser);
  }

  @TransformDto(ReactionResponseDto)
  @Get(':id/reactions')
  @ApiGetOneDoc({
    summary: 'Get Post Reactions',
    response: ReactionResponseDto,
    params: [{ name: 'id', description: 'Post ID' }],
  })
  getPostReactions(@Param('id', ParseObjectIdPipe) postId: string) {
    return this.postsService.getPostReactions(postId);
  }

  @Patch(':id/media/upload')
  @ApiUpdateDoc({
    summary: 'Upload Media files',
    body: UploadMediaUrlsDto,
    description: 'Media Files Uploaded Successfully',
    params: [{ name: 'id', description: 'Post ID' }],
  })
  uploadMedia(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() uploadMediaUrlsDto: UploadMediaUrlsDto,
  ) {
    console.log(uploadMediaUrlsDto);
    return this.postsService.uploadMedia(id, uploadMediaUrlsDto);
  }

  @Delete(':id/media/delete')
  @ApiDeleteDoc({
    summary: 'Remove media files',
    params: [{ name: 'id', description: 'Post ID' }],
    body: DeleteMediaDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMedia(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() deleteMediaDto: DeleteMediaDto,
  ) {
    return this.postsService.removeMedia(id, deleteMediaDto);
  }

  @Delete('reaction')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReactionFromPost(
    @CurrentUser() currentUser: UserDocument,
    @Body() removeReactionDto: RemoveReactionDto,
  ) {
    return this.postsService.removeReactionFromPost(
      removeReactionDto,
      currentUser._id.toString(),
    );
  }

  @Roles('admin')
  @UseGuards(RolesGuard, ProtectOtherUserGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.removePost(id);
  }
}

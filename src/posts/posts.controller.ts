import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { TransformPostResponse } from 'src/_cores/interceptors/post-response.interceptor';
import { PostResponseDto } from './dto/post-response.dto';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@TransformDto(PostResponseDto)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() currentUser:UserDocument) {
    return this.postsService.createPost(createPostDto,currentUser._id.toString());
  }

  @Get()
  findAllPost() {
    return this.postsService.findAllPost();
  }

  @Get(':id')
  findOnePost(@Param('id') id: string) {
    return this.postsService.findOnePost(id);
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  removePost(@Param('id') id: string) {
    return this.postsService.removePost(id);
  }
}

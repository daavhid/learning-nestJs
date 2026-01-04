import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostInterface } from './interfaces/post.interface';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { CurrentUSer, Roles } from 'src/auth/decorators';
import { UserRole } from '@prisma/client';
import { FindQueryDto } from './dto/query.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService:PostsService){}
    @UseGuards(JwtAuthGuard)
    @Get()
     getAllPost(@Query() findQueryDto:FindQueryDto){
        return  this.postsService.getAllPosts(findQueryDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
     getPost(@Param("id",ParseIntPipe) id:number){
        return   this.postsService.getPost(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() createPost:CreatePostDto,@CurrentUSer() user:any){
        return await this.postsService.createPost(createPost,user)

    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    async updatePost(@Param('id',ParseIntPipe) id:number,@Body() updatePost:UpdatePostDto,@CurrentUSer() user:any) {
        return await this.postsService.updatePost(id, updatePost,user)
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id',ParseIntPipe) id:number){
        return await this.postsService.deletePost(id)

    }
}

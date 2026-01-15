import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './Schema/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel:Model<Post>){}
  async createPost(createPostDto: CreatePostDto,userId:string) {
    const newPost =  await  this.postModel.create({
      ...createPostDto,
      author:userId
    })
    await newPost.populate('author')
    return newPost
  }

  findAllPost(postSearchParam:PostSearchParam) {
    return this.postModel.find()
  }

  findOnePost(id: string) {
    return `This action returns a #${id} post`;
  }

  updatePost(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  removePost(id: string) {
    return `This action removes a #${id} post`;
  }
}

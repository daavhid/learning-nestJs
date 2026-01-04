import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { Post } from './interfaces/post.interface';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Posts, Prisma, Users } from '@prisma/client';
import { FindQueryDto } from './dto/query.dto';
import { CACHE_MANAGER,Cache } from '@nestjs/cache-manager';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class PostsService {

    private cacheListSet :Set<string> = new Set()
    private generateCacheKey (query:FindQueryDto) {
        const {limit,page,title} = query
        return `post_list_cache_key_${limit}_${page}_${title}`
    }

    private async invalidateCacheKeys () {
        for (const key of this.cacheListSet){
            await this.cacheManager.del(key)
            this.cacheListSet.clear()
        }
    }
    
    constructor(private Prisma:PrismaService,@Inject(CACHE_MANAGER) private cacheManager: Cache){}



    async getAllPosts(query:FindQueryDto):Promise<PaginatedResponse<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>>>{
        const cacheKey = this.generateCacheKey(query)
        const cachedPosts = await this.cacheManager.get<PaginatedResponse<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>>>(cacheKey)

        if (cachedPosts) {
            console.log(`cached data hit----------`)
            return cachedPosts
        }
        console.log(`cached data miss -----------`)
        const {title,limit,page} = query
        const skip = +(page - 1) * limit

        const whereClause:Prisma.PostsWhereInput = {}

        if(title){
            console.log(title,'title')
            whereClause.title = {
                contains:title as string,
                mode:'insensitive'
            }
        }
        const posts =  await this.Prisma.posts.findMany({
            where:whereClause,
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        username:true,
                        email:true,
                        id:true,
                        role:true
                    }
                }
            },
            orderBy:{id:'desc'},
            skip,
            take:limit
        })
        const postsCount=  await this.Prisma.posts.count({
            where:whereClause,
        })
        this.cacheListSet.add(cacheKey)
        const postResp = {
            items:posts,
            meta:{
                currentPage:page,
                pageSize:limit,
                totalItems:postsCount,
                totalPages:Math.ceil(postsCount / limit),
                hasNextPage:(page * limit) < postsCount,
                hasPreviousPage: page>1

            }
        };
        await this.cacheManager.set(cacheKey,postResp,30000)
        return postResp
    }

    async getPost(id:number):Promise<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>>{
        const single_post_key = `post_key-${id}`
        const cachePost = await this.cacheManager.get<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>>(single_post_key)
        if(cachePost){
            console.log('getting from the cache',this.cacheListSet)
            return cachePost
        }
        console.log('getting from the db',this.cacheListSet)


        const post = await this.Prisma.posts.findFirst({
            where: { id },
        })
        if(!post){
            throw new NotFoundException(`The post with id ${id} not found`)
        }
        this.cacheListSet.add(single_post_key)
        await this.cacheManager.set(single_post_key,post,30000)
        return post
    }

    async getAllUserPosts(user:Users) {
        const posts = await this.Prisma.posts.findMany({
            where:{
                authorId: user.id
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        username:true,
                        email:true,
                        id:true,
                        role:true
                    }
                }
            },
        })

        return posts
    }

    async createPost(post:CreatePostDto,user:Users) :Promise<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>> {

        const newPost = await this.Prisma.posts.create({
            data:{
                ...post,
                authorId:user.id
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        username:true,
                        email:true,
                        id:true,
                        role:true
                    }
                }
            }
        })
        await this.invalidateCacheKeys()

        return newPost
    }

    async updatePost(id:number,post:UpdatePostDto,user:Users) :Promise<Omit<Posts,'createdAt' |'updatedAt'|'authorId'>>{
        const postToUpdate = await this.Prisma.posts.findFirst({
            where:{id}
        })
        if(!postToUpdate){
            throw new NotFoundException(`The post with ${id} was not found`)
        }

        if(postToUpdate.authorId !== user.id && user.role !== 'ADMIN'){
            throw new UnauthorizedException('Cannot perform this action')
        }

        const upDatedPost = await this.Prisma.posts.update({where:{id:postToUpdate.id},
            data:{
                ...post,
                updatedAt:new Date()
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        username:true,
                        email:true,
                        id:true,
                        role:true
                    }
                }
            },
        })
        await this.invalidateCacheKeys()

            return upDatedPost
        }

        async deletePost(id:number):Promise<void> {
            
            const postToDel = await this.Prisma.posts.findFirst({
                where:{id}
            })
            if(!postToDel){
                throw new NotFoundException(`Post of id ${id} not found`)

            }
            await this.Prisma.posts.delete({
                where:{id}
            })
        }

    
}

import { Expose, Transform, Type } from "class-transformer";
import type { Iprivacy } from "../Schema/post.schema";
import { ResponseDto } from "src/auth/dto/response.dto";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class PostAuthorResponseDto {
    @Expose()
    _id:string
    
    @Expose()
    name:string

    @Expose()
    email:string
}

export class PostResponseDto {
    @Expose()
    content:string;

    @Expose()
    backgroundColor:string
    
    @Expose()
    @Type(()=>PostAuthorResponseDto)
    author:PostAuthorResponseDto

    @Expose()
    mediaUrls: string[]

    @Expose()
    privacy:Iprivacy

    @Expose()
    @ObjectId()
    _id:string
}
import { IsHexColor, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import type { Iprivacy } from "../Schema/post.schema";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content:string;

    @IsOptional()
    @IsHexColor()
    backgroundColor:string;

    @IsOptional()
    @IsIn(['public','private','friends'])
    privacy:Iprivacy;

}

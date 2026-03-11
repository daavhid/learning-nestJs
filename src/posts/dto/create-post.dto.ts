import {
  IsArray,
  IsHexColor,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Iprivacy } from '../Schema/post.schema';
import { Type } from 'class-transformer';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';

export class UploadMediaUrlsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadMediaUrlDto)
  media: UploadMediaUrlDto[];
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsHexColor()
  backgroundColor: string;

  @IsOptional()
  @IsIn(['public', 'private', 'friends'])
  privacy: Iprivacy;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UploadMediaUrlDto)
  mediaFiles: UploadMediaUrlDto[];
}

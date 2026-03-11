import { IsOptional, IsString } from 'class-validator';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';
import { Type } from 'class-transformer';

export class UpdateConversationDto {
  @IsOptional()
  @IsString()
  groupName: string;

  @IsOptional()
  6;
  @Type(() => UploadMediaUrlDto)
  groupAvatar: UploadMediaUrlDto;
}

import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';

export class CreateGroupConversationDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  participantIds: string[];

  @IsNotEmpty()
  groupName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UploadMediaUrlDto)
  groupAvatar: UploadMediaUrlDto;
}

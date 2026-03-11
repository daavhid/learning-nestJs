import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsString()
  directParentCommentId: string;

  @IsOptional()
  @IsString()
  replytoUserId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

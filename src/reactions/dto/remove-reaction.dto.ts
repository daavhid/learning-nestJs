import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RemoveReactionDto {
  @IsMongoId()
  @IsNotEmpty()
  postId: string;
}

import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';
import { REACTION_TYPE_ARRAY } from '../constants';

export class CreateReactionDto {
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @IsIn(REACTION_TYPE_ARRAY)
  type: IReactionType;
}

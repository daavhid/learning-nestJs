import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMediaDto {
  @IsNotEmpty()
  @IsString()
  mediaId: string;
}

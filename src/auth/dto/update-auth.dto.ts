import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Mediatype } from 'src/posts/Schema/post.schema';

export class UpdateAuthDto {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @MaxLength(50, { message: 'name cannot exceed 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'email must be a string' })
  bio: string;

  @IsOptional()
  @IsPhoneNumber()
  @IsString({ message: 'email must be a string' })
  phoneNumber: string;

  @IsOptional()
  avater: Mediatype;

  @IsOptional()
  coverPhoto: Mediatype;

  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @MaxLength(50, { message: 'password cannot exceed 50 characters' })
  password: string;
}

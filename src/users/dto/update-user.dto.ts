import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
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
  @IsString({ message: 'password must be a string' })
  @MaxLength(50, { message: 'password cannot exceed 50 characters' })
  password: string;
}

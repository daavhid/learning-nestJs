import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadMediaUrlDto {
  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  resource_type: string;

  @Type(() => Number)
  @IsNotEmpty()
  version: number;

  @IsString()
  @IsNotEmpty()
  display_name: string;
}

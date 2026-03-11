import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CursorObject {
  @IsOptional()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @IsDate()
  createdAt: string;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an Integer' })
  @Min(1, { message: 'Page cannot be less than 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an Integer' })
  @Min(1, { message: 'Limit cannot be less than 1' })
  @Max(100, { message: 'Limit cannot be more than 100' })
  limit: number = 10;

  //support cursor pagination
  @IsOptional()
  @IsString()
  cursor: string;

  // support strict cursor pagination
  @IsOptional()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt: string;
}

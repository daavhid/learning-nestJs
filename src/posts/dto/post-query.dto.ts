import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';

export class PostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @MaxLength(100)
  @IsString()
  search: string;
}

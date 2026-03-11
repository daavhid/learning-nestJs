import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}

import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';

export class MessageQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}

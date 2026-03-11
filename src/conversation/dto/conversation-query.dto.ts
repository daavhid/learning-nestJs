import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';

export class ConversationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsBoolean()
  group: boolean;
}

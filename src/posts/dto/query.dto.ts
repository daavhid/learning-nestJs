import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "src/common/dtos/query-pagination.dto";


export class FindQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsString({message:'title must be a string'})
    @MaxLength(100,{message:`Title search can't exceed 100 characters`})
    title?:String
}
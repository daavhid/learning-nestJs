import {  IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, } from "class-validator";

export class UpdatePostDto {

    @IsOptional()
    @IsNotEmpty({message:"Title must not be empty"})
    @IsString({message:'title must be a string'})
    @MinLength(3,{message:"title must be at least of 3 length"})
    @MaxLength(50,{message:"title must be at most 50 length"})
    title?:string;

    @IsOptional()
    @IsNotEmpty({message:"content must not be empty"})
    @IsString({message:"content must be a string"})
    @MinLength(3,{message:"content must be at least of 3 length"})
    @MaxLength(50,{message:"content must be at most 50 length"})
    content?:string

}
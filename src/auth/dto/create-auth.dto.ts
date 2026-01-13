import {IsEmail, IsNotEmpty,IsString, MaxLength, MinLength} from 'class-validator'

export class SignUpDto {
    @IsNotEmpty({message:'name cannot be empty'})
    @IsString({message:"name must be a string"})
    @MinLength(3,{message:'name must be atleast 3 characters'})
    @MaxLength(50,{message:'name cannot exceed 50 characters'})
    name:string;

    @IsNotEmpty({message:"email cannot be empty"})
    @IsString({message:'email must be a string'})
    @IsEmail()
    email:string;

    @IsNotEmpty({message:'password cannot be empty'})
    @IsString({message:"password must be a string"})
    @MinLength(3,{message:'password must be atleast 3 characters'})
    @MaxLength(50,{message:'password cannot exceed 50 characters'})
    password:string;


}

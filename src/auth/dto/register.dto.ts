import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @MinLength(3,{
        message:'username must be at least 3 char'
    })
    @MaxLength(50,{
        message:"username cannot be more than 50 char"
    })
    username:string

    @IsNotEmpty()
     @MinLength(3,{
        message:'password must be at least 3 characters'
    })
    @MaxLength(50,{
        message:"password cannot be more than 50 characters"
    })
    password:string;
}
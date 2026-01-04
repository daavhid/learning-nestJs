import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @IsNotEmpty()
     @MinLength(3,{
        message:'password must be at least 3 characters'
    })
    @MaxLength(50,{
        message:"password cannot be more than 50 characters"
    })
    password:string;
}
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt'
import { UserRole, Users } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private JwtService:JwtService, 
        private prisma:PrismaService,
    private configService:ConfigService){}

    async register(registerDto : RegisterDto) {
        const existingUser = await this.prisma.users.findFirst({
            where:{email:registerDto.email}
        })

        if(existingUser) {
            throw new ConflictException("Account already registered")
        }

        const hashedPassword = await this.hashPasword(registerDto.password)
        const newUser = await this.prisma.users.create({
            data:{
                ...registerDto,
                password: hashedPassword,
            },
            
        })

        return {
            user:newUser,
            message:'User registered successfully'
        }

    
    }

    async login(loginDto : LoginDto) {
        const existingUser = await this.prisma.users.findFirst({
            where:{email:loginDto.email}
        })

        if(!existingUser || !(await this.verifyPassword(loginDto.password,existingUser.password))){
            throw new UnauthorizedException("Invalid Credentials ")
        }

        const tokens = await this.generateTokens(existingUser)

        return {
            ...tokens,
            message:'Login Successful'
        }

        


    }

    async createAdmin(registerDto :RegisterDto) {
        const existingUser = await this.prisma.users.findFirst({
            where:{email:registerDto.email}
        })

        if(existingUser) {
            throw new ConflictException("Admin account already registered")
        }

        const hashedPassword = await this.hashPasword(registerDto.password)
        const newUser = await this.prisma.users.create({
            data:{
                ...registerDto,
                password: hashedPassword,
                role:UserRole.ADMIN
            },
            
        })

        return {
            user:newUser,
            message:'Admin registered successfully'
        }
    }

    async refreshToken(refreshToken: string) :Promise<{accessToken:string}> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }
        try {
            const payload = await this.JwtService.verify<Promise<{
                sub:number
            }>>(refreshToken,{
                secret:this.configService.get('REFRESH_TOKEN','REFRESH_TOKEN')
            })

            const user = await this.prisma.users.findFirst({
                where:{id:payload.sub}
            })

            if(!user){
                throw new UnauthorizedException('Invalid Token')
            }

            const accessToken = await this.generateAccessToken(user)

            return {accessToken}
            
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException('Invalid Token')
        }
    }

    async getUserById(userId:number) {
        try {
            const user =await  this.prisma.users.findFirst(
                {where:{id:userId},select:{
                    username:true,
                    email:true,
                    role:true,
                    id:true
                }}
            )
            if(!user){
                throw new UnauthorizedException("User not Found")
            }
            return user
        } catch (error) {
            console.log(error,'this is the error')
            // throw new UnauthorizedException()
        }
    }

    private async hashPasword(password:string) : Promise<string> {
        const hash = bcrypt.hash(password,10)
        return hash
    }

    private async verifyPassword(plainPassword:string, hashedPassword:string) {
        const compare =  bcrypt.compare(plainPassword,hashedPassword)

        return compare
    }

    private async generateTokens(user: Users) : Promise<{
        accessToken:string,
        refreshToken:string
    }> {
        return {
            accessToken : await this.generateAccessToken(user),
            refreshToken : await this.generateRefreshToken(user),
        }
    }

    private async generateAccessToken(user: Users) : Promise<string> {
        const payload = {
            sub:user.id,
            email:user.email,
            role:user.role
        }

        const accessToken = await this.JwtService.signAsync(payload,{
            secret: this.configService.get('ACCESS_TOKEN'),
            expiresIn:'15m'
        })

        return accessToken
    }

    private async generateRefreshToken(user: Users) :Promise<string> {
        const payload = {
            sub:user.id
        }
        const refreshToken = await this.JwtService.signAsync(payload,{
            secret:this.configService.get('REFRESH_TOKEN'),
            expiresIn:'7d'
        })

        return refreshToken
    }

}

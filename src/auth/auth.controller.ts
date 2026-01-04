import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { UserRole } from '@prisma/client';
import { Roles,CurrentUSer } from './decorators';
import { RolesGuard,JwtAuthGuard } from './guards';
import { RateThrottleGuard } from './guards/throttler.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() registerDto :RegisterDto) {
       return  this.authService.register(registerDto)
    }

    @UseGuards(RateThrottleGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto : LoginDto){
        return this.authService.login(loginDto)
    }

    @Post('refreshToken')
    @HttpCode(HttpStatus.OK)
    refreshToken(@Body('refresh_token') refreshToken:string){
        return this.authService.refreshToken(refreshToken)
    }

    //profile endpoint
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUSer() user:any) {
        return {
            ...user,
            message:'welcome to your dashboard'
        }

    }
   
    //createAdmin endpoint
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Post('create-admin')
    createAdmin(@Body() registerDto:RegisterDto){
        return this.authService.createAdmin(registerDto)
    }



}

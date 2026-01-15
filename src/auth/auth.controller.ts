import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ResponseDto } from './dto/response.dto';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { RolesGuard } from 'src/_cores/guards/role.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('sign-up')
  signUp(@Body() SignUpDto: SignUpDto) {
    return this.authService.signUp(SignUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @TransformDto(ResponseDto)
  @Get('me')
  getProfile(@CurrentUser() user:any) {
    return user
  }


}

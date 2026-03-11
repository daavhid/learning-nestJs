import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ResponseDto } from './dto/response.dto';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { SignInDto } from './dto/sign-in.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Roles('admin')
  // @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @TransformDto(ResponseDto)
  @Get('me')
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }
}

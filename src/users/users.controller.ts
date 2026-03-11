import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { ResponseDto } from 'src/auth/dto/response.dto';
import { Routes } from 'src/_cores/decorators/route.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from './schemas/user.schema';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetManyDoc,
  ApiGetOneDoc,
  ApiUpdateDoc,
  ApiDeleteDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@TransformDto(ResponseDto)
@Routes('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiGetManyDoc({
    summary: 'Get all users',
    description: 'Retrieve a list of users with optional filters',
    auth: true,
    response: ResponseDto,
    isArray: true,
    queries: [
      {
        name: 'search',
        type: String,
        required: false,
        description: 'Search term for user names or emails',
        example: 'john',
      },
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of users to return',
        example: 10,
      },
      {
        name: 'offset',
        type: Number,
        required: false,
        description: 'Number of users to skip',
        example: 0,
      },
    ],
  })
  @Get()
  findAll(@Query() userQueryDto: UserQueryDto) {
    return this.usersService.findAll(userQueryDto);
  }

  @ApiGetOneDoc({
    summary: 'Get user by ID',
    description: 'Retrieve a single user by their ID',
    auth: true,
    response: ResponseDto,
    params: [
      {
        name: 'id',
        description: 'The ID of the user',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiUpdateDoc({
    summary: 'Upload user avatar',
    description: 'Upload or update user avatar image',
    auth: true,
    body: UploadMediaUrlDto,
    response: ResponseDto,
  })
  @Patch('upload-avatar')
  uploadAvatar(
    @CurrentUser() user: UserDocument,
    @Body() avatarmediaDto: UploadMediaUrlDto,
  ) {
    return this.usersService.uploadAvatar(user._id.toString(), avatarmediaDto);
  }

  @ApiUpdateDoc({
    summary: 'Upload user cover photo',
    description: 'Upload or update user cover photo',
    auth: true,
    body: UploadMediaUrlDto,
    response: ResponseDto,
  })
  @Patch('upload-coverPhoto')
  uploadCoverPhoto(
    @CurrentUser() user: UserDocument,
    @Body() coverphotoMediaDto: UploadMediaUrlDto,
  ) {
    return this.usersService.uploadCoverPhoto(
      user._id.toString(),
      coverphotoMediaDto,
    );
  }

  @ApiUpdateDoc({
    summary: 'Update user',
    description: 'Update user information',
    auth: true,
    body: UpdateUserDto,
    response: ResponseDto,
    params: [
      {
        name: 'id',
        description: 'The ID of the user to update',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiDeleteDoc({
    summary: 'Delete user',
    description: 'Delete a user account',
    auth: true,
    params: [
      {
        name: 'id',
        description: 'The ID of the user to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}

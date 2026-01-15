import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { RolesGuard } from 'src/_cores/guards/role.guard';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { ResponseDto } from 'src/auth/dto/response.dto';
import { ProtectOtherUserGuard } from 'src/_cores/guards/user-protect.guard';

@UseGuards(JwtAuthGuard)
@TransformDto(ResponseDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(ProtectOtherUserGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

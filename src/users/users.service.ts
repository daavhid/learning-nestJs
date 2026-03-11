import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UploadMediaUrlDto } from 'src/_cores/global/dtos';
import { UserQueryDto } from './dto/user-query.dto';
import { cursorPaginationResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(
    userQueryDto: UserQueryDto,
  ): Promise<cursorPaginationResponse<User>> {
    //so we want to implenent cursor based pagination with the names as the cursor
    //let us build our query
    const queryBuilder: Record<string, any> = {
      isActive: true,
    };

    if (userQueryDto.search) {
      queryBuilder.$or = [
        { name: { $regex: userQueryDto.search, $options: 'i' } },
        { email: { $regex: userQueryDto.search, $options: 'i' } },
      ];
    }

    if (userQueryDto.cursor) {
      queryBuilder.name = {
        $gt: userQueryDto.cursor,
      };
    }
    const users = await this.userModel
      .find(queryBuilder)
      .sort({ name: 1 })
      .limit(userQueryDto.limit + 1)
      .exec();

    const hasNextPage = users.length > userQueryDto.limit;

    const newUsers = hasNextPage ? users.slice(0, userQueryDto.limit) : users;
    const newCursor = hasNextPage
      ? newUsers[newUsers.length - 1].name.toString()
      : null;
    return {
      data: newUsers,
      meta: {
        hasNextPage,
        cursor: newCursor,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      isActive: true,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found `);
    }
    return user;
  }

  async uploadAvatar(id: string, avatarMediaDto: UploadMediaUrlDto) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        avatar: avatarMediaDto,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not Found');

    return user;
  }
  async uploadCoverPhoto(id: string, coverphotoMediaDto: UploadMediaUrlDto) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        coverPhoto: coverphotoMediaDto,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not Found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      updateUserDto,
      { new: true },
    );
    if (!user) throw new NotFoundException('User not Found');

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not Found');
  }
}

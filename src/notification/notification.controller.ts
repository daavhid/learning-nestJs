import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import type { UserDocument } from 'src/users/schemas/user.schema';
import { PaginationQueryDto } from 'src/common/dtos/query-pagination.dto';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetManyDoc,
  ApiUpdateDoc,
  ApiDeleteDoc,
} from 'src/_cores/swagger/swagger-api.decorator';

@ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiGetManyDoc({
    summary: 'Get notifications',
    description: 'Get list of user notifications',
    auth: true,
    response: Object, // Assuming a notification DTO
    isArray: true,
    queries: [
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of notifications to return',
        example: 10,
      },
      {
        name: 'offset',
        type: Number,
        required: false,
        description: 'Number of notifications to skip',
        example: 0,
      },
    ],
  })
  @Get('')
  getNotifications(
    @CurrentUser() currentUser: UserDocument,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.notificationService.getNotifications(
      currentUser,
      paginationQueryDto,
    );
  }

  @ApiUpdateDoc({
    summary: 'Mark all notifications as read',
    description: 'Mark all user notifications as read',
    auth: true,
    response: Object,
  })
  @Patch('/readAll')
  markAllAsRead(@CurrentUser() currentUser: UserDocument) {
    return this.notificationService.markAllAsRead(currentUser);
  }

  @ApiUpdateDoc({
    summary: 'Mark notification as read',
    description: 'Mark a specific notification as read',
    auth: true,
    response: Object,
    params: [
      {
        name: 'id',
        description: 'The ID of the notification',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Patch(':id/read')
  markNotificationAsRead(@Param('id', ParseObjectIdPipe) id: string) {
    return this.notificationService.markNotificationAsRead(id);
  }

  @ApiDeleteDoc({
    summary: 'Delete notification',
    description: 'Delete a specific notification',
    auth: true,
    params: [
      {
        name: 'id',
        description: 'The ID of the notification to delete',
        type: String,
        example: '507f1f77bcf86cd799439011',
      },
    ],
  })
  @Delete(':id')
  deleteNotification(@Param('id', ParseObjectIdPipe) id: string) {
    return this.notificationService.deleteNotification(id);
  }
}

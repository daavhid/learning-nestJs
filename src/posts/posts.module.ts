import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [PrismaModule,AuthModule,CacheModule.register()],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}

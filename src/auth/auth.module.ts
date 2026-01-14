import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/_cores/strategies/jwt-strategy.strategy';
import { JwtAuthGuard } from 'src/_cores/guards/jwt-auth.guard';
import { RolesGuard } from 'src/_cores/guards/role.guard';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.register({
      global: true,
    }),],
  controllers: [AuthController],
  providers: [AuthService,JwtService,JwtStrategy,JwtAuthGuard,RolesGuard],
})
export class AuthModule {}

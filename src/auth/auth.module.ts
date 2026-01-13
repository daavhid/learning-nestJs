import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.register({
      global: true,
    }),],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
})
export class AuthModule {}

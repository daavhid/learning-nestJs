import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateThrottleGuard } from './guards/throttler.guard';

@Module({
  imports: [JwtModule.register({}),PassportModule,ThrottlerModule.forRoot({
    throttlers:[
      {
        ttl:60000,
        limit:3
      }
    ]
  })],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard,RolesGuard,JwtStrategy,RateThrottleGuard]
})
export class AuthModule {}


import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( configService:ConfigService) {
    super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:configService.get('JWT_SECRET_ACCESS_TOKEN')!
    });
  }

  async validate(): Promise<any> {
    const user = null
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

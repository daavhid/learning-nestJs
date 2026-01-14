
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor( configService:ConfigService, private authService:AuthService) {
    super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:configService.get('JWT_SECRET_ACCESS_TOKEN')!
    });
  }

  async validate(payload:any): Promise<any> {
    const user = await this.authService.findOne({_id:payload.sub});
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

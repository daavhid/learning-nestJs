import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( config:ConfigService,private authService:AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('ACCESS_TOKEN')!
        })
    }

    async validate(payload:any) {
        try{
            const user = await this.authService.getUserById(payload.sub)
            if(!user){
                throw new UnauthorizedException('User not Authenticated')
            }
            return user

        }catch(e){
            throw new UnauthorizedException('Invalid Token')
        }

        
    }
}
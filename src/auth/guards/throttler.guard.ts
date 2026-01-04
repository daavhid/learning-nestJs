import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";


@Injectable()

export class RateThrottleGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>,): Promise<string> {
        if(req.user){
            return `user-${req.user.id}`
        }

        return req.ips.length ? req.ips[0] : req.ip;
        
    }

    protected async getErrorMessage(): Promise<string> {
        throw new ThrottlerException('Too many request try again later')
        
    }
}
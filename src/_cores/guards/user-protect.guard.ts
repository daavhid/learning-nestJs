import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestWithUser } from "../decorators/current-user.decorator";


export class ProtectOtherUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest<RequestWithUser>()
        const user = request.user
        if(user._id.toString() !== request.params.id){
            throw new ForbiddenException('You cannot access a resource that is not yours')
        }

        return true
    }
}
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, RolesKey } from "../decorators/role.decorator";
import { RequestWithUser } from "../decorators/current-user.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role []>(RolesKey,
            [context.getHandler(),context.getClass()]
        )


        if(!requiredRoles){
            return true;
        }

        const {user} = context.switchToHttp().getRequest<RequestWithUser>()

        if(!requiredRoles.includes(user.role)){
            throw new ForbiddenException('You dont have access to this resource')
        }
        
        return true
    }
}
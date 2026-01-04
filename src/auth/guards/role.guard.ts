import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles_key } from "../decorators/role.decorator";
import { UserRole } from "@prisma/client";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(Roles_key,[
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles){
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        if(!user){
            throw new ForbiddenException('User is not Authenticated')
        }

        if(!requiredRoles.includes(user.role)){
            throw new ForbiddenException('Insufficient Permission to access this resource')
        }

        return true

    }
}
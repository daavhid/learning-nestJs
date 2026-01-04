import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Users } from "@prisma/client";
import { Request } from "express";


export const CurrentUSer = createParamDecorator((data:unknown,ctx:ExecutionContext)=>{
    const request = ctx.switchToHttp().getRequest<Request>()
    const  user = request.user as Omit<Users,'password' | 'createdAt' | 'updatedAt'>

    return user

})
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { UserDocument } from "src/users/schemas/user.schema";

export interface RequestWithUser extends Request {
    user:UserDocument
}

export const CurrentUser = createParamDecorator((data:unknown,context:ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    return request.user
})
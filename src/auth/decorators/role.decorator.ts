import { SetMetadata } from "@nestjs/common"
import { UserRole } from "@prisma/client"


export const Roles_key = 'roles'

export const Roles = (...roles:UserRole[])=>SetMetadata(Roles_key,roles)
import { SetMetadata } from "@nestjs/common"

export type Role = 'user' | 'admin'
export const RolesKey = 'roles'

export const Roles = (...roles:Role[]) => SetMetadata(RolesKey,roles)
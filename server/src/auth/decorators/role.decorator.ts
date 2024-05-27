import { RoleEnum } from '../../user/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Roles = ([...roles]: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

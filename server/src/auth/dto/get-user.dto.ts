import { RoleEnum } from '../../user/role.enum';

export class GetUserDto {
  username: string;
  email: string;
  role: RoleEnum;
}

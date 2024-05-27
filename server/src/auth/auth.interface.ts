import { RoleEnum } from '../user/role.enum';

export interface LoggedUser {
  _id: string;
  username: string;
  email: string;
  role: RoleEnum;
}

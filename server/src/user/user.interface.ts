import { RoleEnum } from './role.enum';

export interface UserResponse {
  _id: string;
  role: RoleEnum;
  email: string;
  username: string;
}

export interface FullUserResponse {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
}

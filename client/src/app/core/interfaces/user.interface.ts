export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRoleEnum;
}

export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface Report {
  title: string;
  text: string;
  author: Author;
}

interface Author {
  id: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface NewsAuthor {
  id: string;
  username: string;
  email: string;
}

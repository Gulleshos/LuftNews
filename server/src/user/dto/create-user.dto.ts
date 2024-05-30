import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { RoleEnum } from '../role.enum';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(16)
  @IsNotEmpty()
  password: string;

  role: RoleEnum;
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GetUserDto } from './dto/get-user.dto';
import { LoggedUser } from './auth.interface';
import { FullUserResponse } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserLogin(email: string, pass: string): Promise<boolean> {
    const user: FullUserResponse = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'The user with the specified email does not exist',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Password invalid', HttpStatus.CONFLICT);
    }

    return true;
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: LoggedUser }> {
    try {
      const user = await this.userService.createUser(createUserDto);
      const tokenPayload = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const token = await this.getToken(tokenPayload);
      return {
        token,
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: LoggedUser }> {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(
        'The user with the specified email does not exist',
      );
    }

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const tokenPayload = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const token = await this.getToken(tokenPayload);
      return {
        token,
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
      };
    } else {
      throw new UnauthorizedException('Password is incorrect');
    }
  }

  async getToken(getUserDto: GetUserDto): Promise<string> {
    return this.jwtService.sign(getUserDto);
  }
}

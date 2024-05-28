import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Report } from './schemas/report.schema';
import { RoleEnum } from './role.enum';
import { AddReportDto } from './dto/add-report.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './user.interface';
import emailjs from '@emailjs/nodejs';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { LoggedUser } from '../auth/auth.interface';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Report.name) private reportModel: Model<Report>,
  ) {}

  async getUserByEmail(email: string): Promise<{
    _id: string;
    username: string;
    email: string;
    password: string;
    role: RoleEnum;
  }> {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('This email is already in use');
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = new this.userModel({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      role: RoleEnum.USER,
    });

    const savedUser = await newUser.save();

    return {
      _id: savedUser._id.toString(),
      role: savedUser.role,
      email: savedUser.email,
      username: savedUser.username,
    };
  }

  async addReport(addReportDto: AddReportDto): Promise<Report> {
    return await this.reportModel.create(addReportDto);
  }

  async findAllReports(): Promise<Report[]> {
    return await this.reportModel.find().exec();
  }

  async subscribeToCategory(subscribeDto: SubscribeDto): Promise<LoggedUser> {
    return this.userModel.findByIdAndUpdate(
      subscribeDto.userId,
      { $addToSet: { subscribedCategories: subscribeDto.category } },
      { new: true },
    );
  }

  async unsubscribeFromCategory(
    subscribeDto: SubscribeDto,
  ): Promise<LoggedUser> {
    return this.userModel.findByIdAndUpdate(
      subscribeDto.userId,
      { $pull: { subscribedCategories: subscribeDto.category } },
      { new: true },
    );
  }

  async isSubscribed(
    subscribeDto: SubscribeDto,
  ): Promise<{ isSubscribed: boolean }> {
    const result = await this.userModel.findOne({ subscribedCategories: { $in: [subscribeDto.category] } });
    return { isSubscribed: !!result };
  }

  sendLetter(recipient: string, title: string) {
    const templateParams = {
      email: recipient,
      title: title,
    };

    emailjs
      .send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, templateParams, {
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY,
      })
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (err) => {
          console.log('FAILED...', err);
        },
      );
  }

  async notifySubscribers(news: CreateNewsDto) {
    const subscribedUsers = await this.userModel.find({
      subscribedCategories: { $in: news.categories },
    });
    if (subscribedUsers) {
      for (const user of subscribedUsers) {
        this.sendLetter(user.email, news.title);
      }
    }
  }
}

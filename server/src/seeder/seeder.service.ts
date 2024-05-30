import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../user/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { Report } from '../user/schemas/report.schema';
import * as bcrypt from 'bcrypt';
import { Category } from '../category/schemas/category.schema';
import { News } from '../news/schemas/news.schema';
import { Comment } from '../news/schemas/comment.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(News.name) private readonly newsModel: Model<News>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async seed() {
    const savedUsers = [];
    const users = [
      {
        username: 'John Doe',
        email: 'john@example.com',
        password: '111111',
        role: RoleEnum.USER,
      },
      {
        username: 'Jane Doe',
        email: 'jane@example.com',
        password: '111111',
        role: RoleEnum.ADMIN,
      },
    ];
    for (const user of users) {
      const salt = await bcrypt.genSalt(7);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = new this.userModel({
        email: user.email,
        username: user.username,
        password: hashedPassword,
        role: user.role,
      });
      await newUser.save().then((user) =>
        savedUsers.push({
          _id: user._id.toString(),
          role: user.role,
          email: user.email,
          username: user.username,
        }),
      );
    }

    const categories = [
      {
        title: 'global',
        description: 'global category',
      },
      {
        title: 'health',
        description: 'health category',
      },
      {
        title: 'technologies',
        description: 'technologies category',
      },
    ];
    for (const category of categories) {
      const existingCategory = await this.categoryModel.findOne({
        title: category.title,
      });
      if (!existingCategory) {
        await this.categoryModel.create(category);
      }
    }

    const savedNews = [];
    const newsList = [
      {
        title: 'Mega urgent news!',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        author: {
          id: savedUsers[1]._id,
          username: savedUsers[1].username,
        },
        categories: ['global', 'health'],
        date: new Date(),
      },
      {
        title: 'Mega urgent news!',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        author: {
          id: savedUsers[1]._id,
          username: savedUsers[1].username,
        },
        categories: ['global', 'technologies'],
        date: new Date(),
      },
      {
        title: 'Mega urgent news!',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        author: {
          id: savedUsers[1]._id,
          username: savedUsers[1].username,
        },
        categories: ['global', 'health'],
        date: new Date(),
      },
    ];
    for (const news of newsList) {
      await this.newsModel.create(news).then((news) => savedNews.push(news));
    }

    const comments = [
      {
        text: 'Wow!',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        news: savedNews[0]._id,
        date: new Date(),
      },
      {
        text: 'Wow!',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        news: savedNews[1]._id,
        date: new Date(),
      },
      {
        text: 'Wow!',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        news: savedNews[2]._id,
        date: new Date(),
      },
    ];
    for (const comment of comments) {
      const news = await this.newsModel.findById(comment.news);
      if (news) {
        await this.commentModel.create(comment);
      }
    }

    const reports = [
      {
        title: 'Report',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
      {
        title: 'Report',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
      {
        title: 'Report',
        author: {
          id: savedUsers[0]._id,
          name: savedUsers[0].username,
        },
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      },
    ];
    for (const report of reports) {
      await this.reportModel.create(report);
    }

    console.log('Seeding complete!');
  }
}

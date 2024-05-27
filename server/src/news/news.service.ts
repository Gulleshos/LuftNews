import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './schemas/news.schema';
import { Comment } from './schemas/comment.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { PaginationDto } from './dto/pagination.dto';
import { NewsResponse } from './news.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private userService: UserService,
  ) {}

  private async paginate(
    model: Model<any>,
    query: any,
    page: number,
    limit: number,
  ): Promise<NewsResponse> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page or limit cannot be negative');
    }

    const count = await model.countDocuments(query).exec();
    const offset = (page - 1) * limit;
    const data = await model.find(query).skip(offset).limit(limit).exec();

    return { data, totalNews: count };
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<News> {
    this.userService.notifySubscribers(createNewsDto);
    return await this.newsModel.create(createNewsDto);
  }

  async findAllNews({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<NewsResponse> {
    return this.paginate(this.newsModel, {}, page, limit);
  }

  async findNewsById(newsId: string): Promise<News | null> {
    return this.newsModel.findById(newsId).exec();
  }

  async findNewsByCategory(
    category: string,
    { page = 1, limit = 10 }: PaginationDto,
  ): Promise<NewsResponse> {
    const query = { categories: { $in: [category] } };
    return this.paginate(this.newsModel, query, page, limit);
  }

  async findNewsByAuthor(
    author: string,
    { page = 1, limit = 10 }: PaginationDto,
  ): Promise<NewsResponse> {
    const query = { 'author.id': author };
    return this.paginate(this.newsModel, query, page, limit);
  }

  async findNewsByQuery(
    query: string,
    {
      page = 1,
      limit = 10,
      category,
    }: { page?: number; limit?: number; category?: string },
  ): Promise<NewsResponse> {
    if (!query) {
      throw new Error('Query parameter is required');
    }
    const regex = new RegExp(query, 'i');
    const queryObj: any = {
      $or: [{ title: { $regex: regex } }, { text: { $regex: regex } }],
    };
    if (category) {
      queryObj.categories = { $in: [category] };
    }
    return this.paginate(this.newsModel, queryObj, page, limit);
  }

  async addComment(
    newsId: string,
    addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    const news = await this.newsModel.findById(newsId);
    if (!news) {
      throw new NotFoundException('News item not found');
    }

    const newComment = new this.commentModel({
      ...addCommentDto,
      news: newsId,
    });

    return await newComment.save();
  }

  async findAllCommentsByNews(newsId: string): Promise<Comment[]> {
    const news = await this.newsModel.findById(newsId);
    if (!news) {
      throw new NotFoundException('News item not found');
    }
    return await this.commentModel.find({ news: newsId }).exec();
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../user/role.enum';
import { CreateNewsDto } from './dto/create-news.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles([RoleEnum.ADMIN])
  async createNews(@Body() createNewsDto: CreateNewsDto) {
    return await this.newsService.createNews(createNewsDto);
  }

  @Get()
  async getNews(@Query() { page, limit }) {
    return this.newsService.findAllNews({ page, limit });
  }

  @Get(':id')
  async getNewsById(@Param('id') newsId: string) {
    return await this.newsService.findNewsById(newsId);
  }

  @Get('category/:category')
  async getNewsByCategory(
    @Param('category') category: string,
    @Query() { page, limit },
  ) {
    return await this.newsService.findNewsByCategory(category, { page, limit });
  }

  @Get('author/:author')
  async getNewsByAuthor(
    @Param('author') author: string,
    @Query() { page, limit },
  ) {
    return await this.newsService.findNewsByAuthor(author, { page, limit });
  }

  @Get('search/:query')
  async getNewsByQuery(
    @Param('query') query: string,
    @Query() { page, limit, category },
  ) {
    return await this.newsService.findNewsByQuery(query, {
      page,
      limit,
      category,
    });
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') newsId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return await this.newsService.addComment(newsId, addCommentDto);
  }

  @Get(':id/comments')
  async getAllCommentsByNews(@Param('id') newsId: string) {
    return await this.newsService.findAllCommentsByNews(newsId);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Report, ReportSchema } from '../user/schemas/report.schema';
import { SeederService } from './seeder.service';
import { News, NewsSchema } from '../news/schemas/news.schema';
import { Comment, CommentSchema } from '../news/schemas/comment.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Report.name, schema: ReportSchema },
      { name: News.name, schema: NewsSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}

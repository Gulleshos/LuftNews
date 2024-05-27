import { IsDateString, IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  author: {
    name: string;
    id: string;
  };

  @IsNotEmpty()
  news: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}

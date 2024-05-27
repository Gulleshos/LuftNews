import { IsDateString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateNewsDto {
  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  author: {
    id: string;
    username: string;
  };

  @IsNotEmpty()
  categories: string[];

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}

import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddReportDto {
  @MinLength(3)
  @MaxLength(24)
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  author: {
    id: string;
    name: string;
  };
}

import { IsNotEmpty } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

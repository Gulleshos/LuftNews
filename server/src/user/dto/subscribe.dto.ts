import { IsNotEmpty } from 'class-validator';

export class SubscribeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  category: string;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@Schema()
export class Category {
  @Prop()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  title: string;

  @Prop()
  @IsNotEmpty()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

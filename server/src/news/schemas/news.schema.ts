import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class News {
  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop({ type: Object })
  author: {
    name: string;
    id: mongoose.Schema.Types.ObjectId;
  };

  @Prop()
  categories: string[];

  @Prop()
  date: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);

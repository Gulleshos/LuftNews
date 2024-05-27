import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Comment {
  @Prop()
  text: string;

  @Prop({ type: Object })
  author: {
    name: string;
    id: mongoose.Schema.Types.ObjectId;
  };

  @Prop()
  news: string;

  @Prop()
  date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

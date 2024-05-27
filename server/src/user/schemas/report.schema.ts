import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Report {
  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop({ type: Object })
  author: {
    name: string;
    id: string;
  };
}

export const ReportSchema = SchemaFactory.createForClass(Report);

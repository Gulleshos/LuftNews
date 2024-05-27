import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEnum } from '../role.enum';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: RoleEnum;

  @Prop()
  subscribedCategories: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

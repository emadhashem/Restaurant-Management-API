import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Restaurant } from 'src/restaurant/schema/restaurant.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ type: [String], required: true })
  favoriteCuisines: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] })
  following: Restaurant[];
}

export const UserSchema = SchemaFactory.createForClass(User);

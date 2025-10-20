import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ _id: false })
class Name {
  @Prop({ required: true, trim: true })
  en: string;

  @Prop({ required: true, trim: true })
  ar: string;
}

@Schema({ _id: false })
class Point {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true, index: '2dsphere' })
  coordinates: number[]; // [longitude, latitude]
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ type: Name, required: true })
  name: Name;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ type: [String], required: true, validate: [ (val: string[]) => val.length >= 1 && val.length <= 3, 'A restaurant must have between 1 and 3 cuisines.' ]})
  cuisines: string[];

  @Prop({ type: Point, required: true })
  location: Point;

  @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
  followers: string[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

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

  @Prop({ type: [String], required: true })
  cuisines: string[];

  @Prop({ type: Point, required: true })
  location: Point;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Create a 2dsphere index for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

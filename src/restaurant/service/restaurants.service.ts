import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import slugify from 'slugify';
import { Restaurant, RestaurantDocument } from '../schema/restaurant.schema';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { FilterRestaurantDto } from '../dto/query-params.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  /**
   * Creates a new restaurant entry in the database.
   * A unique slug is generated from the English name.
   */
  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const slug = slugify(createRestaurantDto.name.en, {
        lower: true,
        strict: true,
      });

      const restaurantData = {
        ...createRestaurantDto,
        slug,
        location: {
          type: 'Point',
          coordinates: [
            createRestaurantDto.location.lon,
            createRestaurantDto.location.lat,
          ],
        },
      };

      const createdRestaurant = new this.restaurantModel(restaurantData);
      return createdRestaurant.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'A restaurant with the same name already exists.',
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Finds all restaurants, with an optional filter by cuisine.
   */
  async findAll(filters: FilterRestaurantDto): Promise<Restaurant[]> {
    const query = filters.cuisine ? { cuisines: filters.cuisine } : {};
    return this.restaurantModel.find(query).exec();
  }

  /**
   * Finds a single restaurant by its MongoDB ObjectId or its unique slug.
   */
  async findOne(idOrSlug: string): Promise<Restaurant | null> {
    const query = isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };
    return this.restaurantModel.findOne(query).exec();
  }

  /**
   * Finds restaurants within a 1km radius of the given coordinates.
   * Uses MongoDB's geospatial $near query.
   */
  async findNearby(lon: number, lat: number): Promise<Restaurant[]> {
    const ONE_KILOMETER_IN_METERS = 1000;

    return this.restaurantModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            $maxDistance: ONE_KILOMETER_IN_METERS,
          },
        },
      })
      .exec();
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import {
  Restaurant,
  RestaurantDocument,
} from 'src/restaurant/schema/restaurant.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  /**
   * Creates a new user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'A user with the same name already exists.',
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Adds a restaurant to a user's "following" list.
   */
  async followRestaurant(userId: string, restaurantId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const restaurant = await this.restaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID "${restaurantId}" not found`,
      );
    }

    // Use $addToSet to avoid duplicate entries in the 'following' array
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { following: restaurantId } },
      { new: true }, // Return the updated document
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return updatedUser;
  }

  /**
   * Implements the recommendation logic using a MongoDB Aggregation Pipeline.
   * Step 1: Find users who share at least one favorite cuisine with the target user.
   * Step 2: Aggregate the list of restaurants followed by those similar users.
   * Step 3: Return both lists.
   */
  async getRecommendations(userId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const targetUser = await this.userModel.findById(userId);
    if (!targetUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const pipeline = [
      // Step 1: Find other users who share at least one favorite cuisine.
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) }, // Exclude the user themselves
          favoriteCuisines: { $in: targetUser.favoriteCuisines },
        },
      },
      // Step 2: Retrieve the full restaurant documents followed by these users.
      {
        $lookup: {
          from: 'restaurants', // The name of the restaurants collection
          localField: 'following',
          foreignField: '_id',
          as: 'followedRestaurants',
        },
      },
      // Step 3: Reshape the data for the final response.
      {
        $group: {
          _id: null, // Group all documents into a single result
          // Collect all unique similar users
          similarUsers: { $addToSet: '$$ROOT' },
          // Collect all unique restaurants from all similar users
          restaurants: { $addToSet: '$followedRestaurants' },
        },
      },
      {
        $project: {
          _id: 0,
          users: '$similarUsers',
          // The 'restaurants' field is now an array of arrays. Flatten it.
          restaurants: {
            $reduce: {
              input: '$restaurants',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },
    ];

    const result = await this.userModel.aggregate(pipeline);

    // If no similar users are found, the aggregation will return an empty array.
    if (result.length === 0) {
      return {
        users: [],
        restaurants: [],
      };
    }

    return result[0];
  }
}

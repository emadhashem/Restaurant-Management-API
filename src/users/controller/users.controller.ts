import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { FollowRestaurantDto } from '../dto/follow.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post(':userId/follow')
  @ApiOperation({ summary: 'Follow a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Successfully followed the restaurant.',
  })
  @ApiResponse({ status: 404, description: 'User or Restaurant not found.' })
  followRestaurant(
    @Param('userId') userId: string,
    @Body() followDto: FollowRestaurantDto,
  ) {
    return this.usersService.followRestaurant(userId, followDto.restaurantId);
  }

  @Get(':userId/recommendations')
  @ApiOperation({ summary: 'Get restaurant recommendations for a user' })
  @ApiResponse({
    status: 200,
    description: 'A list of recommended restaurants and similar users.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getRecommendations(@Param('userId') userId: string) {
    return this.usersService.getRecommendations(userId);
  }
}

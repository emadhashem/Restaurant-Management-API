import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  FilterRestaurantDto,
  NearbyRestaurantsDto,
} from '../dto/query-params.dto';
import { RestaurantsService } from '../service/restaurants.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'The restaurant has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all restaurants' })
  @ApiQuery({
    name: 'cuisine',
    required: false,
    description: 'Filter restaurants by cuisine',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants.',
  })
  findAll(@Query() filters: FilterRestaurantDto) {
    return this.restaurantsService.findAll(filters);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby restaurants within 1km' })
  @ApiResponse({
    status: 200,
    description: 'List of nearby restaurants.',
  })
  findNearby(@Query() query: NearbyRestaurantsDto) {
    return this.restaurantsService.findNearby(query.lon, query.lat);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get restaurant details' })
  @ApiResponse({ status: 200, description: 'Restaurant details.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    const restaurant = await this.restaurantsService.findOne(idOrSlug);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with "${idOrSlug}" not found`);
    }
    return restaurant;
  }
}

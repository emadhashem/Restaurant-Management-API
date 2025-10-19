import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FollowRestaurantDto {
  @ApiProperty({
    example: '635f7f3e8f8f8f8f8f8f8f8f',
    description: 'The MongoDB ObjectId of the restaurant to follow',
  })
  @IsNotEmpty()
  @IsMongoId()
  restaurantId: string;
}

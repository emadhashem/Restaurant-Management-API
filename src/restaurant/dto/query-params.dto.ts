import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class FilterRestaurantDto {
  @ApiPropertyOptional({
    example: 'Burgers',
    description: 'Filter restaurants by a specific cuisine',
  })
  @IsOptional()
  @IsString()
  cuisine?: string;
}

export class NearbyRestaurantsDto {
  @ApiProperty({
    example: 40.73061,
    description: 'Your current latitude',
  })
  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @ApiProperty({
    example: -73.935242,
    description: 'Your current longitude',
  })
  @Type(() => Number)
  @IsLongitude()
  lon: number;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Type } from 'class-transformer';

class NameDto {
  @ApiProperty({
    example: 'The Burger Hub',
    description: 'English name of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({
    example: 'ذا برجر هب',
    description: 'Arabic name of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  ar: string;
}

class LocationDto {
  @ApiProperty({
    example: -73.935242,
    description: 'Longitude of the restaurant location',
  })
  @IsLongitude()
  lon: number;

  @ApiProperty({
    example: 40.73061,
    description: 'Latitude of the restaurant location',
  })
  @IsLatitude()
  lat: number;
}

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'English and Arabic names for the restaurant',
    type: NameDto,
  })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({
    example: ['Burgers', 'American'],
    description: 'List of cuisines (1 to 3)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  cuisines: string[];

  @ApiProperty({
    description: 'Geographical coordinates of the restaurant',
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

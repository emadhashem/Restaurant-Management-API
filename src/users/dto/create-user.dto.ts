import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: ['Italian', 'Asian'],
    description: "A list of the user's favorite cuisines",
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  favoriteCuisines: string[];
}

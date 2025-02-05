import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception', description: 'Nom du film' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 120, description: 'Durée du film en minutes' })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'Un film de science-fiction de Christopher Nolan', description: 'Description du film' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

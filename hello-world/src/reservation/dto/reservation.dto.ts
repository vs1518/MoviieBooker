import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'ID de l\'utilisateur' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: 'ID du film à réserver' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({ example: '2025-02-10T15:00:00.000Z', description: 'Date et heure de la réservation' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;
}

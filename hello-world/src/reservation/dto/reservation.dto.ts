import { IsDateString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email de l\'utilisateur' })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ example: 1, description: 'ID du film à réserver' })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({ example: '2025-02-10T15:00:00.000Z', description: 'Date et heure de la réservation' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;
}

import {
  Controller, Post, Get, Delete, Body, Param, Req, UseGuards, BadRequestException, ParseIntPipe
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiTags('Reservations')
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  async create(
    @Req() req,
    @Body() createReservationDto: CreateReservationDto
  ): Promise<any> {
    createReservationDto.userId = req.user.userId;

    if (!createReservationDto.movieId || !createReservationDto.startTime || !createReservationDto.slot) {
      throw new BadRequestException('movieId, startTime et slot sont obligatoires.');
    }

    // Vérifiez la disponibilité du créneau
    const isSlotAvailable = await this.reservationService.isSlotAvailable(
      createReservationDto.movieId,
      createReservationDto.startTime
    );

    if (!isSlotAvailable) {
      throw new BadRequestException('Le créneau horaire n\'est pas disponible.');
    }

    return this.reservationService.createReservation(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer les réservations de l\'utilisateur' })
  async findAll(@Req() req): Promise<any> {
    const userId = req.user.userId;
    return this.reservationService.getReservations(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  async remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const userId = req.user.userId;
    return this.reservationService.cancelReservation(id, userId);
  }
}

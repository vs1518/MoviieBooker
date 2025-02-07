import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>
  ) {}

  async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { movieId, userId, startTime } = createReservationDto;

    const movieIdNumber = Number(movieId);
    if (isNaN(movieIdNumber)) {
      throw new BadRequestException('movieId doit être un nombre valide.');
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      throw new BadRequestException('startTime doit être une date valide.');
    }

    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    // Vérifier les conflits de réservation
    const existingReservation = await this.reservationRepository.findOne({
      where: {
        userId,
        startTime: Between(start, end),
      }
    });

    if (existingReservation) {
      throw new BadRequestException('Un autre film est déjà réservé sur ce créneau.');
    }

    const reservation = this.reservationRepository.create({
      userId,
      movieId: movieIdNumber,
      startTime: start,
      endTime: end,
    });

    return await this.reservationRepository.save(reservation);
  }

  async getReservations(userId: number) {
    return await this.reservationRepository.find({
      where: { userId },
      order: { startTime: 'ASC' }
    });
  }

  async cancelReservation(reservationId: number, userId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId, userId }
    });
    
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable.');
    }

    await this.reservationRepository.remove(reservation);
    return { message: 'Réservation annulée avec succès.' };
  }

  async reserveMovie(movieId: number, userId: number): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      movieId,
      userId,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
    });

    return await this.reservationRepository.save(reservation);
  }

  async isSlotAvailable(movieId: number, startTime: string): Promise<boolean> {
    const date = new Date(startTime);
    const existingReservation = await this.reservationRepository.findOne({
      where: { movieId, startTime: date }
    });
    return !existingReservation;
  }
}

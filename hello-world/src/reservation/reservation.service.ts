import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';

interface Reservation {
  id: number;
  userId: number;
  movieId: number;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class ReservationService {
  private reservations: Reservation[] = [];
  private idCounter = 1;

  async createReservation(userId: number, createReservationDto: CreateReservationDto) {
    const { movieId, startTime } = createReservationDto;

    const movieIdNumber = Number(movieId);
    if (isNaN(movieIdNumber)) {
      throw new BadRequestException('movieId doit être un nombre valide.');
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      throw new BadRequestException('startTime doit être une date valide.');
    }

    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // ✅ Durée du film = 2h

    const conflict = this.reservations.some(res =>
      res.userId === userId &&
      ((start >= res.startTime && start < res.endTime) || (end > res.startTime && end <= res.endTime))
    );

    if (conflict) {
      throw new BadRequestException('Un autre film est déjà réservé sur ce créneau.');
    }

    const newReservation: Reservation = {
      id: this.idCounter++,
      userId,
      movieId: movieIdNumber,
      startTime: start,
      endTime: end,
    };

    this.reservations.push(newReservation);
    return newReservation;
  }

  async getReservations(userId: number) {
    return this.reservations.filter(res => res.userId === userId);
  }

  async cancelReservation(reservationId: number, userId: number) {
    const index = this.reservations.findIndex(res => res.id === reservationId && res.userId === userId);
    
    if (index === -1) {
      throw new NotFoundException('Réservation introuvable.');
    }

    this.reservations.splice(index, 1);
    return { message: 'Réservation annulée avec succès.' };
  }
}

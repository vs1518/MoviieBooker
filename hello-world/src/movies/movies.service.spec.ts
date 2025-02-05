import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reserve a movie successfully', () => {
    const movie = service.createMovie({ title: 'Inception', duration: 120, description: 'Science-fiction' });
    const userId = 1;

    const reservation = service.reserveMovie(movie.id, userId);
    
    expect(reservation).toBeDefined();
    expect(reservation.reservation).toHaveProperty('id');
    expect(reservation.reservation.userId).toBe(userId);
  });

  it('should throw an error when reserving a non-existing movie', () => {
    expect(() => service.reserveMovie(999, 1)).toThrow(NotFoundException);
  });

  it('should cancel a reservation successfully', () => {
    const movie = service.createMovie({ title: 'Avatar', duration: 160, description: 'Science-fiction' });
    const userId = 2;
    
    const reservation = service.reserveMovie(movie.id, userId);
    const reservationId = reservation.reservation.id;

    const result = service.cancelReservation(movie.id, reservationId);
    
    expect(result).toEqual({ message: 'Réservation annulée avec succès' });
    expect(movie.reservations.length).toBe(0);
  });

  it('should throw an error when canceling a reservation on a non-existing movie', () => {
    expect(() => service.cancelReservation(999, 1)).toThrow(NotFoundException);
  });

  it('should throw an error when canceling a non-existing reservation', () => {
    const movie = service.createMovie({ title: 'Titanic', duration: 195, description: 'Romance/Drame' });

    expect(() => service.cancelReservation(movie.id, 999)).toThrow(NotFoundException);
  });
});

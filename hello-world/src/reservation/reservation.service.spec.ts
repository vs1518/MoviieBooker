import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const createReservationDto: CreateReservationDto = {
        userEmail: 'user@example.com',
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z',
      };

      const reservation = await service.createReservation(1, createReservationDto);
      expect(reservation).toHaveProperty('id');
      expect(reservation.userEmail).toBe(createReservationDto.userEmail);
      expect(reservation.movieId).toBe(createReservationDto.movieId);
    });

    it('should throw an error if there is a time conflict', async () => {
      const createReservationDto: CreateReservationDto = {
        userEmail: 'user@example.com',
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z',
      };

      // Create a first reservation
      await service.createReservation(1, createReservationDto);

      // Try to create another reservation that conflicts with the first one
      try {
        await service.createReservation(1, createReservationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Un autre film est déjà réservé sur ce créneau.');
      }
    });
  });

  describe('getReservations', () => {
    it('should return a list of reservations for the user', async () => {
      const createReservationDto: CreateReservationDto = {
        userEmail: 'user@example.com',
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z',
      };

      // Create a reservation for the user
      const reservation = await service.createReservation(1, createReservationDto);

      // Get reservations for the user
      const reservations = await service.getReservations(1);
      expect(reservations).toHaveLength(1);
      expect(reservations[0].id).toBe(reservation.id);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', async () => {
      const createReservationDto: CreateReservationDto = {
        userEmail: 'user@example.com',
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z',
      };

      const reservation = await service.createReservation(1, createReservationDto);

      // Cancel the reservation
      const response = await service.cancelReservation(reservation.id, 1);
      expect(response.message).toBe('Réservation annulée avec succès');
    });

    it('should throw an error if the reservation is not found', async () => {
      try {
        await service.cancelReservation(999, 1); // Using a non-existing reservation ID
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Réservation introuvable');
      }
    });
  });
});

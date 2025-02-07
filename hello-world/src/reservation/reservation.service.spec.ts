import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies/movies.controller';
import { MoviesService } from '../movies/movies.service';
import { NotFoundException } from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';

jest.mock('../movies/movies.service', () => {
  return {
    reserveMovie: jest.fn().mockImplementation((movieId, userId) => {
      // Si movieId est 999, on lance une exception NotFoundException
      if (movieId === 999) {
        throw new NotFoundException('Film non trouvé');
      }
      // Sinon on retourne une réservation valide
      return { id: 123, userId, movieId };
    }),
    cancelReservation: jest.fn().mockImplementation((movieId, reservationId) => {
      // Si reservationId est incorrect, on lance une exception NotFoundException
      if (reservationId !== 123) {
        throw new NotFoundException('Réservation non trouvée');
      }
      // Sinon, on simule l'annulation de la réservation
      return { message: 'Réservation annulée avec succès' };
    })
  };
});

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reserve', () => {
    it('should reserve a movie', async () => {
      const userId = 1;
      const movieId = 1;

      // Mock de la méthode reserveMovie avec un retour correct
      jest.spyOn(service, 'reserveMovie').mockReturnValue({
        message: 'Réservation réussie',
        reservation: {
          id: 123,
          userId,
      
        }
      });

      // Appel de la méthode reserve via le controller
      const result = await controller.reserve(movieId, userId);

      // Vérification que le résultat est celui attendu
      expect(result).toEqual({
        id: 123,
        userId,
        movieId,
      });
    });

    it('should throw NotFoundException for non-existent movie', async () => {
      // Mock d'un comportement où le film n'existe pas (movieId = 999)
      jest.spyOn(service, 'reserveMovie').mockImplementation(() => {
        throw new NotFoundException('Film non trouvé');
      });

      // Vérification que la méthode reserve lance bien l'exception
      await expect(controller.reserve(999, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const movieId = 1;
      const reservationId = 123;
      const userId = 4;

    
      // Réservation d'un film
      const reservation = await service.reserveMovie(movieId, userId);

      // Appel de la méthode cancelReservation via le controller
      const result = await controller.cancelReservation(movieId, reservation.id);

      // Vérification que l'annulation de la réservation renvoie le bon message
      expect(result).toEqual({ message: 'Réservation annulée avec succès' });
    });

    it('should throw NotFoundException when canceling a non-existing reservation', async () => {
      const movieId = 1;
      const reservationId = 999;  // ID de réservation fictif pour simuler une non-existence

      // Mock d'un échec dans cancelReservation
      jest.spyOn(service, 'cancelReservation').mockImplementation(() => {
        throw new NotFoundException('Réservation non trouvée');
      });

      // Vérification que l'on lance bien l'exception NotFoundException
      await expect(controller.cancelReservation(movieId, reservationId)).rejects.toThrow(NotFoundException);
    });
  });
});

interface IReservation {
  id: number;
  userId: number;
  movieId: number;
  startTime: Date;
  endTime: Date;
}

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const dto: CreateReservationDto = {
        userId: 1,
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z'
      };

      const result = await service.createReservation(dto);

      expect(result).toEqual({
        id: expect.any(Number),
        userId: 1,
        movieId: 1,
        startTime: expect.any(Date),
        endTime: expect.any(Date)
      });
    });

    it('should throw BadRequestException for invalid movieId', async () => {
      const dto: CreateReservationDto = {
        userId: 1,
        movieId: NaN,
        startTime: '2025-02-10T15:00:00.000Z'
      };

      await expect(service.createReservation(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', async () => {
      // Créer d'abord une réservation
      const dto: CreateReservationDto = {
        userId: 1,
        movieId: 1,
        startTime: '2025-02-10T15:00:00.000Z'
      };

      const mockReservation: IReservation = await service.createReservation(dto);
      const result = await service.cancelReservation(mockReservation.id, mockReservation.userId);
      
      expect(result).toEqual({ message: 'Réservation annulée avec succès.' });
    });

    it('should throw NotFoundException for non-existent reservation', async () => {
      await expect(service.cancelReservation(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reserveMovie', () => {
    it('should reserve a movie successfully', async () => {
      const movieId = 1;
      const userId = 1;

      const result = await service.reserveMovie(movieId, userId);

      expect(result).toEqual({
        movieId,
        userId,
        id: expect.any(Number),
        startTime: expect.any(Date),
        endTime: expect.any(Date)
      });
    });
  });
});

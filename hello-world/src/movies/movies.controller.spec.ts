import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

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

  it('should reserve a movie via the controller', async () => {
    const movie = service.createMovie({ title: 'Matrix', duration: 136, description: 'Action/SF' });
    const userId = 3;

    const result = await controller.reserve(movie.id, userId);
    
    expect(result).toBeDefined();
    expect(result.reservation).toHaveProperty('id');
    expect(result.reservation.userId).toBe(userId);
  });

  it('should cancel a reservation via the controller', () => {
    const movie = service.createMovie({ title: 'Interstellar', duration: 169, description: 'Science-fiction' });
    const userId = 4;

    const reservation = service.reserveMovie(movie.id, userId);
    const reservationId = reservation.reservation.id;

    const result = controller.cancelReservation(movie.id, reservationId);
    
    expect(result).toEqual({ message: 'Réservation annulée avec succès' });
    expect(movie.reservations.length).toBe(0);
  });

  it('should return an error when reserving a non-existing movie via controller', () => {
    expect(() => controller.reserveMovie(999, 5)).toThrow(NotFoundException);
  });

  it('should return an error when canceling a non-existing reservation via controller', () => {
    const movie = service.createMovie({ title: 'Dune', duration: 155, description: 'Science-fiction' });

    expect(() => controller.cancelReservation(movie.id, 999)).toThrow(NotFoundException);
  });
});

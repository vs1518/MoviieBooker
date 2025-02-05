import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [ReservationService],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should reserve a movie', () => {
    const movieId = 1;
    const userId = 2;

    jest.spyOn(service, 'reserveMovie').mockImplementation(() => ({
      message: 'Réservation effectuée avec succès',
      reservation: { id: 123, userId },
    }));

    expect(controller.reserve(movieId, { userId })).toEqual({
      message: 'Réservation effectuée avec succès',
      reservation: { id: 123, userId },
    });
  });

  it('should cancel a reservation', () => {
    const movieId = 1;
    const reservationId = 123;

    jest.spyOn(service, 'cancelReservation').mockImplementation(() => ({
      message: 'Réservation annulée avec succès',
    }));

    expect(controller.cancel(movieId, reservationId)).toEqual({
      message: 'Réservation annulée avec succès',
    });
  });
});

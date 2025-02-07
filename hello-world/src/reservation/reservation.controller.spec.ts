import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [{
        provide: ReservationService,
        useValue: {
          createReservation: jest.fn(),
          getReservations: jest.fn(),
          cancelReservation: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should create a reservation', async () => {
    const mockRequest = {
      user: { userId: 1 }
    };

    const createReservationDto: CreateReservationDto = {
      userId: 1,
      movieId: 1,
      startTime: '2025-02-10T15:00:00.000Z'
    };

    const expectedReservation = {
      id: 1,
      userId: 1,
      movieId: 1,
      startTime: new Date('2025-02-10T15:00:00.000Z'),
      endTime: new Date(new Date('2025-02-10T15:00:00.000Z').getTime() + 2 * 60 * 60 * 1000),
    };

    jest.spyOn(service, 'createReservation').mockResolvedValue(expectedReservation);

    const result = await controller.create(mockRequest, createReservationDto);
    expect(result).toEqual(expectedReservation);
  });
});
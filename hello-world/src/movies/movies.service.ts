import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservation/entities/reservation.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>
  ) {}

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Film avec l'ID ${id} non trouvé`);
    }
    return movie;
  }

  async create(movie: Partial<Movie>): Promise<Movie> {
    const newMovie = this.movieRepository.create(movie);
    return await this.movieRepository.save(newMovie);
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create({
      title: createMovieDto.title,
      duration: createMovieDto.duration,
      description: createMovieDto.description,
    });
    return await this.movieRepository.save(movie);
  }

  async reserveMovie(movieId: number, userId: number) {
    const movie = await this.findOne(movieId);
    if (!movie) {
      throw new NotFoundException(`Film avec l'ID ${movieId} non trouvé`);
    }

    const reservation = this.reservationRepository.create({
      movieId,
      userId,
      movieTitle: movie.title,
      startTime: new Date(),
      endTime: new Date(Date.now() + movie.duration * 60 * 1000),
    });

    await this.reservationRepository.save(reservation);
    return { 
      message: 'Réservation effectuée avec succès',
      reservation 
    };
  }

  async cancelReservation(movieId: number, reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId, movieId }
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    await this.reservationRepository.remove(reservation);
    return { message: 'Réservation annulée avec succès' };
  }
}

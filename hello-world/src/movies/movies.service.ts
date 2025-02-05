import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.interface';

@Injectable()
export class MoviesService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly movies: Movie[] = [];

  constructor() {
    this.apiUrl = 'https://example.com/api';
    this.apiKey = 'your_api_key';
  }

  createMovie(createMovieDto: CreateMovieDto): Movie {
    const newMovie: Movie = {
      id: Date.now(),
      title: createMovieDto.title,
      duration: createMovieDto.duration,
      description: createMovieDto.description,
      reservations: [],
    };

    this.movies.push(newMovie);
    return newMovie;
  }

  findAllMovies(): Movie[] {
    return this.movies;
  }

  reserveMovie(movieId: number, userId: number) {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    const reservation = {
      id: Date.now(),
      userId,
    };

    movie.reservations.push(reservation);
    return { message: 'Réservation effectuée avec succès', reservation };
  }

  cancelReservation(movieId: number, reservationId: number) {
    const movie = this.movies.find(m => m.id === movieId);
    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    const reservationIndex = movie.reservations.findIndex(r => r.id === reservationId);
    if (reservationIndex === -1) {
      throw new NotFoundException('Réservation non trouvée');
    }

    movie.reservations.splice(reservationIndex, 1);
    return { message: 'Réservation annulée avec succès' };
  }
}

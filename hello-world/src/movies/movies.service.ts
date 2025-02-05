import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('TMDB_API_URL') || 'https://api.themoviedb.org/3';
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async getNowPlaying(page = 1) {
    const url = `${this.apiUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));  // ✅ Convertit Observable en Promise
    return response.data;
  }

  async searchMovies(query: string, page = 1) {
    if (!this.apiKey || !this.apiUrl) {
        throw new Error('TMDB API Key or URL is missing');  // ✅ Gestion d’erreur
      }
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }

  // 🔹 Obtenir les détails d’un film spécifique
  async getMovieDetails(movieId: number) {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data;
  }
}

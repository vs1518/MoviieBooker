import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@ApiTags('Films')
@ApiExtraModels(CreateMovieDto)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un film' })
  @ApiResponse({
    status: 201,
    description: 'Film créé avec succès',
    content: {
      'application/json': {
        example: {
          id: 1,
          title: 'Inception',
          duration: 120,
          description: 'Un film de science-fiction de Christopher Nolan',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur de validation' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des films' })
  @ApiResponse({
    status: 200,
    description: 'Liste des films récupérée avec succès',
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            title: 'Inception',
            duration: 120,
            description: 'Un film de science-fiction de Christopher Nolan',
          },
          {
            id: 2,
            title: 'Titanic',
            duration: 195,
            description: 'Un film dramatique et romantique',
          },
        ],
      },
    },
  })
  async findAll() {
    return this.moviesService.findAllMovies();
  }
  @Post(':id/reserve')
  @ApiOperation({ summary: 'Réserver un film' })
  @ApiResponse({ 
    status: 201, 
    description: 'Réservation effectuée avec succès' })
  @ApiResponse({ 
    status: 404, 
    description: 'Film non trouvé' })
  async reserve(
    @Param('id') movieId: number, 
    @Body('userId') userId: number) {
    return this.moviesService.reserveMovie(movieId, userId);
  }

  @Delete(':id/reservations/:reservationId')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ 
    status: 200, 
    description: 'Réservation annulée avec succès' })
  @ApiResponse({ 
    status: 404, 
    description: 'Film ou réservation non trouvée' })
  async cancelReservation(@Param('id') 
  movieId: number, 
  @Param('reservationId') reservationId: number) {
    return this.moviesService.cancelReservation(movieId, reservationId);
  }
}

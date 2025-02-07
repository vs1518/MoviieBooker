import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@ApiExtraModels(CreateMovieDto)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Récupérer tous les films' })
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un film par son ID' })
  async findOne(@Param('id') id: string): Promise<Movie> {
    return this.moviesService.findOne(+id);
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

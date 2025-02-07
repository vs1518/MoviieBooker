import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ReservationModule } from './reservation/reservation.module';
import { User } from './user/user.entity';
import { Movie } from './movies/movie.entity';
import { Reservation } from './reservation/entities/reservation.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'mot_de_passe',
      database: process.env.DB_NAME || 'moviiebooker',
      entities: [User, Movie, Reservation],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    MoviesModule,
    ReservationModule,
  ],
})
export class AppModule {}

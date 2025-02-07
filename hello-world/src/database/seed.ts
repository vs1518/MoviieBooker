import { DataSource } from 'typeorm';
import { seedDatabase } from './seeds/initial-data.seed';
import { User } from '../user/user.entity';
import { Movie } from '../movies/movie.entity';
import { Reservation } from '../reservation/entities/reservation.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'mot_de_passe',
  database: process.env.DB_NAME || 'moviiebooker',
  entities: [User, Movie, Reservation],
  synchronize: true,
});

dataSource.initialize()
  .then(() => {
    console.log('Base de données connectée avec succès');
    return seedDatabase(dataSource);
  })
  .then(() => {
    console.log('Seed terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }); 
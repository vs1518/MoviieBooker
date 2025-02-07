import { DataSource } from 'typeorm';
import { User } from '../../user/user.entity';
import { Movie } from '../../movies/movie.entity';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

async function getRandomMovies() {
  const page = Math.floor(Math.random() * 100) + 1;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&include_adult=false&include_video=false&language=fr-FR&page=${page}&sort_by=popularity.desc`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results) {
      return data.results.slice(0, 20); // On prend les 20 premiers films
    } else {
      console.error('Erreur TMDB:', data);
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    return [];
  }
}

export const seedDatabase = async (dataSource: DataSource) => {
  try {
    // Supprimer toutes les données existantes
    await dataSource.query('TRUNCATE TABLE "user" CASCADE');
    await dataSource.query('TRUNCATE TABLE "movie" CASCADE');
    await dataSource.query('TRUNCATE TABLE "reservation" CASCADE');

    console.log('Tables nettoyées avec succès');

    // Créer des utilisateurs
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.save([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    ]);

    console.log('Utilisateurs créés avec succès');

    // Récupérer et créer les films depuis TMDB
    const movieRepository = dataSource.getRepository(Movie);
    const tmdbMovies = await getRandomMovies();
    
    if (tmdbMovies.length === 0) {
      console.log('Aucun film récupéré depuis TMDB, utilisation des films par défaut');
      const defaultMovies = [
        {
          title: 'Inception',
          description: 'Un film de science-fiction sur les rêves',
          duration: 148,
        },
        {
          title: 'The Dark Knight',
          description: 'Un film de super-héros épique',
          duration: 152,
        },
        {
          title: 'Interstellar',
          description: 'Une odyssée spatiale',
          duration: 169,
        },
      ];
      
      await movieRepository.save(defaultMovies);
      console.log(`${defaultMovies.length} films par défaut créés`);
    } else {
      const movies = await Promise.all(
        tmdbMovies.map(async (movieData) => {
          const movie = movieRepository.create({
            title: movieData.title,
            description: movieData.overview,
            duration: Math.floor(Math.random() * 60) + 90, // Durée aléatoire entre 90 et 150 minutes
          });
          return await movieRepository.save(movie);
        })
      );
      console.log(`${movies.length} films TMDB créés`);
    }

    console.log('Base de données remplie avec succès !');
    console.log(`${users.length} utilisateurs créés`);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    throw error;
  }
}; 
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

const movieService = {
  getPopularMovies: async (page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
      throw error;
    }
  },

  searchMovies: async (query, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${query}&page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche des films:', error);
      throw error;
    }
  }
};

export default movieService;
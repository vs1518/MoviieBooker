import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  config => {
    // Ajouter le token JWT s'il existe
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    console.log('Sending Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  response => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      console.error('Response Error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data
      });

      // Gérer les erreurs d'authentification
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('No response received:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};

const movieService = {
  getAllMovies: async () => {
    try {
      const response = await api.get('/movies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMovie: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reserveMovie: async (movieId, startTime) => {
    try {
      const response = await api.post(`/movies/${movieId}/reserve`, { startTime });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

const reservationService = {
  getUserReservations: async () => {
    try {
      const response = await api.get('/reservations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      const response = await api.delete(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { api as default, authService, movieService, reservationService };
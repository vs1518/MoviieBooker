import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import movieService from '../services/movieService';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Ajoutez cet état pour le créneau
  const [userId, setUserId] = useState(null); // Ajoutez cet état pour l'utilisateur

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = searchQuery
        ? await movieService.searchMovies(searchQuery, currentPage, 10)
        : await movieService.getPopularMovies(currentPage, 10);
      setMovies(data.results);
    } catch (err) {
      setError('Erreur lors du chargement des films');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const handleReservation = async (movieId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Veuillez vous connecter pour réserver');
        return;
      }

      const response = await api.post('/reservations', {
        movieId,
        slot: selectedSlot, // Utilisez le créneau sélectionné
        userId: user.id, // Utilisez l'ID de l'utilisateur
        startTime: new Date().toISOString()
      });

      alert('Réservation effectuée avec succès !');
      setShowReservationModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un film..."
          className="w-full p-2 border rounded"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3">{movie.overview}</p>
              <button
                onClick={() => {
                  setSelectedMovie(movie);
                  setShowReservationModal(true);
                }}
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Réserver
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Précédent
        </button>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Suivant
        </button>
      </div>

      {/* Modal de confirmation de réservation */}
      {showReservationModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirmer la réservation</h3>
            <p>Voulez-vous réserver une séance pour {selectedMovie.title} ?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowReservationModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={() => handleReservation(selectedMovie.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
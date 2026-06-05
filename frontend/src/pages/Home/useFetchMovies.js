import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies?limit=100`)
      .then((response) => {
        // backend returns { movies: [...] }
        const data = response.data?.movies || response.data || [];
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { movies, loading, error };
}

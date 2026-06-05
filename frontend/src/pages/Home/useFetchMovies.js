import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies(searchTerm = '') {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('limit', '100');
    if (searchTerm) {
      params.append('q', searchTerm);
    }

    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies?${params.toString()}`)
      .then((response) => {
        const data = response.data?.movies || response.data || [];
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm]);

  return { movies, loading, error };
}

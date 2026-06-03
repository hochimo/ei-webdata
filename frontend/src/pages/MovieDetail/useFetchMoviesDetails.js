import { useState, useEffect } from 'react';
import axios from 'axios';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

export function useFetchMoviesDetails(movieId) {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    setLoading(true);
    Promise.all([ // pour faire 2 requêtes en même temps
      axios.get('https://api.themoviedb.org/3/movie/' + movieId, {
        headers: {
          Authorization: 'Bearer ' + API_TOKEN,
        },
      }),
      axios.get('https://api.themoviedb.org/3/movie/' + movieId + '/credits', {
        headers: {
          Authorization: 'Bearer ' + API_TOKEN,
        },
      }),
    ])
      .then((responses) => {
        setMovie(responses[0].data);
        setCredits(responses[1].data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [movieId]);

  return { movie, credits, loading, error };
}

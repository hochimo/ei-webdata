import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchUserRatings(userId) {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setRatings([]);
      return;
    }

    setError(null);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user_id/ratings`)
      .then((response) => {
        setRatings(response.data.ratings || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de charger les films notés.');
      });
  }, [userId]);

  return { ratings, error };
}
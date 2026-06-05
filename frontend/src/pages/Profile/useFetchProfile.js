import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchProfile(userId) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}/ratings`)
      .then((res) => {
        setRatings(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  return { ratings, loading, error };
}

export default useFetchProfile;

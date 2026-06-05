import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Hook pour récupérer les recommandations de films pour un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {number} limit - Nombre de recommandations (défaut: 5)
 * @returns {object} { recommendations, loading, error }
 */
export function useFetchRecommendations(userId, limit = 5) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setRecommendations([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/recommendations/${userId}?limit=${limit}`
      )
      .then((response) => {
        setRecommendations(response.data.recommendations || []);
      })
      .catch((err) => {
        console.error('Erreur lors du fetch des recommandations:', err);
        setError('Impossible de charger les recommandations.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, limit]);

  return { recommendations, loading, error };
}

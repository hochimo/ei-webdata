import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './RatingForm.css';

function RatingForm({ movieId, movieTitle }) {
  const { selectedUser } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userRating, setUserRating] = useState(null);

  // Récupérer la note existante de l'utilisateur pour ce film
  useEffect(() => {
    if (!selectedUser || !movieId) return;

    const fetchUserRating = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ratings?userId=${selectedUser.id}&movieId=${movieId}`
        );
        if (response.data.rating) {
          setRating(response.data.rating.note);
          setUserRating(response.data.rating.note);
        }
      } catch (error) {
        console.log('Pas de note existante pour ce film');
      }
    };

    fetchUserRating();
  }, [selectedUser, movieId]);

  const handleSubmitRating = async (ratingValue) => {
    if (!selectedUser) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un utilisateur' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ratings`, {
        user_id: selectedUser.id,
        movie_id: movieId,
        note: ratingValue,
      });

      setRating(ratingValue);
      setUserRating(ratingValue);
      setMessage({
        type: 'success',
        text: `Film noté ${ratingValue}/5 !`,
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la sauvegarde de votre note',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="rating-form">
        <p className="rating-no-user">Sélectionnez un utilisateur pour noter ce film</p>
      </div>
    );
  }

  return (
    <div className="rating-form">
      <div className="rating-container">
        <h4>Votre notation :</h4>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${
                star <= (hoveredRating || rating) ? 'filled' : 'empty'
              }`}
              onClick={() => handleSubmitRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={loading}
              aria-label={`Noter ${star} étoiles`}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && <p className="rating-value">Votre note: {rating}/5</p>}
      </div>

      {message && (
        <div className={`rating-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default RatingForm;

import { Link, useParams } from 'react-router-dom';
import { useFetchMoviesDetails } from './useFetchMoviesDetails';

function MovieDetail() {
  const { id } = useParams();
  const { movie, loading, error } = useFetchMoviesDetails(id);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message || error.toString()}</div>;
  if (!movie) return <div>Film non trouvé</div>;

  return (
    <div className="movie-detail">
      <Link to="/" className="movie-detail-back">
        ← Retour à l'accueil
      </Link>
      <h1>{movie.title || movie.name || 'Titre inconnu'}</h1>
      <p>{movie.release_date}</p>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        />
      )}
      <p>{movie.overview}</p>
    </div>
  );
}

export default MovieDetail;
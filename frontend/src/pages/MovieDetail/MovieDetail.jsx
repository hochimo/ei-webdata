import { Link, useParams } from 'react-router-dom';
import { useFetchMoviesDetails } from './useFetchMoviesDetails';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const { movie, credits, loading, error } = useFetchMoviesDetails(id);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message || error.toString()}</div>;
  if (!movie) return <div>Film non trouvé</div>;

  return (
    <div className="movie-detail">
      <Link to="/" className="movie-detail-retour">
        ← Retour à l'accueil
      </Link>

      <div className="movie-detail-content">
        <div className="movie-detail-img">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title || movie.name || 'Affiche du film'}
            />
          )}
        </div>

        <div className="movie-detail-info">
          <div>
            <h1>{movie.title || movie.name || 'Titre inconnu'}</h1>
            <h4 className="movie-detail-date">Release Date : {movie.release_date}</h4>
          </div>

          <div className="movie-detail-overview">
            <h4>Synopsis :</h4>
            <p className="movie-detail-synopsis">{movie.overview}</p>
          </div>

          <div className="movie-detail-credits">
            <h4>Credits :</h4>
            <p>{credits?.cast?.slice(0, 5).map((actor) => actor.name).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MovieDetail;
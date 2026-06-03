import { Link, useParams } from 'react-router-dom';
import { useFetchMoviesDetails } from './useFetchMoviesDetails';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const { movie, loading, error } = useFetchMoviesDetails(id);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message || error.toString()}</div>;
  if (!movie) return <div>Film non trouvé</div>;

  return (
    <div className="movie-detail">
      <Link to="/" className="movie-detail-retour">
        ← Retour à l'accueil
      </Link>
      
      <div className='movie-detail-img'>
        {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        />
      )}
      <div className="movie-detail-info">

        <h1>{movie.title || movie.name || 'Titre inconnu'}</h1>
        <h4 className="movie-detail-date"> Release Date :  {movie.release_date}</h4>
        <h4> Synopsis :</h4>
        <p className="movie-detail-synopsis">{movie.overview}</p>
      </div>
    </div>
</div>
  );
}

export default MovieDetail;
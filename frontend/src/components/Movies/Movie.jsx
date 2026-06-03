import './Movie.css';
import {Link} from "react-router-dom";

function MoviesTable({ movies }) {
  return (
    <div className="movies-grid">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : null;

        return (
          <Link to={`/movies/${movie.id}`} state={{ movie }} key={movie.id} >
            <article className="movie-card" >
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title || 'Film'} />
              ) : (
                <div className="movie-card-empty">Aucune image disponible</div>
              )}
              <div className="movie-card-content">
                <h3 className="movie-card-title">{movie.title || movie.name || 'Titre inconnu'}</h3>
                <p className="movie-card-date">{movie.release_date || movie.first_air_date || ''}</p>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}

export default MoviesTable;

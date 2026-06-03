import './Movie.css';

function MoviesTable({ movies }) {
  return (
    <div className="movies-grid">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : null;

        return (
          <article className="movie-card" key={movie.id}>
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
        );
      })}
    </div>
  );
}

export default MoviesTable;

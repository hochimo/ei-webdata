import { useState } from 'react';
import { useFetchMovies } from './useFetchMovies';

import './Home.css';
import MoviesTable from '../../components/Movies/Movie';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, loading, error } = useFetchMovies();

  const filteredMovies = movies.filter((movie) => {
    if (!movieName) {
      return true;
    }

    const lowerName = movieName.toLowerCase();
    const title = movie.title || movie.name || '';

    return title.toLowerCase().includes(lowerName);
  });

  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          <input
            name="name"
            placeholder="Rechercher un film"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
          {movieName && <p>Recherche : {movieName}</p>}
        </p>
        {loading && <p>Chargement...</p>}
        {error && <p>Erreur !</p>}
        <div className="recommended-section">
          <h3 className="recommended-title">Films recommandés pour vous</h3>
        </div>
        <div className="popular-section">
          <h3 className="popular-title">Films populaires</h3>
        </div>
        <MoviesTable movies={filteredMovies} />
      </header>
    </div>
  );
}

export default Home;

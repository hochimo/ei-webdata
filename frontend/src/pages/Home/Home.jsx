import { useState } from 'react';
import { useFetchMovies } from './useFetchMovies';
import logo from './logo.svg';
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <input
            name="name"
            placeholder="Nom du film"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
          {movieName && <p>Recherche : {movieName}</p>}
        </p>
        {loading && <p>Chargement...</p>}
        {error && <p>Erreur !</p>}
        <MoviesTable movies={filteredMovies} />
      </header>
    </div>
  );
}

export default Home;

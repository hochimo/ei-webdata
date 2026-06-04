import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useFetchMovies } from './useFetchMovies';
import { useFetchRecommendations } from './useFetchRecommendations';

import './Home.css';
import MoviesTable from '../../components/Movies/Movie';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { selectedUser } = useUser();
  const { movies, loading, error } = useFetchMovies();
  const { recommendations, loading: recLoading } = useFetchRecommendations(
    selectedUser?.id,
    5
  );

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
        {selectedUser && (
          <div className="recommended-section">
            <h3 className="recommended-title">Films recommandés pour vous</h3>
            {recLoading && <p>Chargement des recommandations...</p>}
            {recommendations.length > 0 ? (
              <MoviesTable movies={recommendations.map((rec) => rec.movie)} />
            ) : (
              <p>Aucune recommandation disponible. Notez des films pour avoir des suggestions !</p>
            )}
          </div>
        )}
        <div className="popular-section">
          <h3 className="popular-title">Films populaires</h3>
        </div>
        <MoviesTable movies={filteredMovies} />
      </header>
    </div>
  );
}

export default Home;

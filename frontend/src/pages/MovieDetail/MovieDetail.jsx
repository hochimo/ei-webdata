import { useState } from 'react';
import { useFetchMovies } from './useFetchMovies';

import MoviesTable from '../../components/Movies/Movie';

function MovieDetail() {
  const [movieName, setMovieName] = useState('');
  const { movie, loading, error } = useFetchMoviesDetails(movieId);//besoin d'avoir le movie id ???

    return (
        <div className="App">
            <header className="App-header">
                <p>
                    nom du film : {movieName}
                </p>
            </header>
        </div>
    );
}
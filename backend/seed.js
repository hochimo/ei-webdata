import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import axios from 'axios';

const seedDatabaseFromAPI = async () => {
  try {
    
    await appDataSource.initialize();
    console.log("Connexion à la base de données réussie !");
    const movieRepository = appDataSource.getRepository(Movie);

    // Configuration Axios 
    const axiosConfig = {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
      }
    };
    let allTmdbMovies = []; // Tableau pour stocker tous les films récupérés de TMDB
    
    console.log("Récupération des films depuis TMDB");
   // Boucle pour récupérer les pages x à y
    for (let page = 80; page <= 89; page++) {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?page=${page}`, axiosConfig);
      allTmdbMovies = allTmdbMovies.concat(response.data.results);
    }

    console.log("Récupération des acteurs pour chaque film");
    
    // 3. On "traduit" les données de TMDB et on récupère les crédits pour chaque film
    // L'utilisation de Promise.all() permet de faire les requêtes en parallèle plutôt qu'une par une
    const moviesToInsert = await Promise.all(allTmdbMovies.map(async (tmdbMovie) => {
      
     // 1. On sécurise l'année de sortie
      let releaseYear = null;
      if (tmdbMovie.release_date) {
        const parsedYear = parseInt(tmdbMovie.release_date.substring(0, 4));
        // On vérifie que le résultat EST un vrai nombre avant de l'assigner
        if (!isNaN(parsedYear)) {
          releaseYear = parsedYear;
        }
      }

      // 2. On sécurise les notes au cas où TMDB renverrait des valeurs vides
      const voteAverage = isNaN(tmdbMovie.vote_average) || tmdbMovie.vote_average === null ? 0 : tmdbMovie.vote_average;
      const voteCount = isNaN(tmdbMovie.vote_count) || tmdbMovie.vote_count === null ? 0 : tmdbMovie.vote_count; 
      // Requête vers l'API des crédits pour CE film précis
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovie.id}/credits`, axiosConfig);
      
      // On trie le casting par popularité décroissante et on en garde 5
      const top5Actors = creditsResponse.data.cast
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5)
        .map(actor => actor.name); // On extrait uniquement les noms des acteurs

      return {
        title: tmdbMovie.title,
        id: tmdbMovie.id,
        synopsis: tmdbMovie.overview,
        genres: tmdbMovie.genre_ids,
        vote_average: tmdbMovie.vote_average,
        vote_count: tmdbMovie.vote_count,
        year: releaseYear, // Utilisation de l'année sécurisée
        actors: top5Actors // Ajout de notre nouveau tableau des 5 acteurs les plus populaires
      };
    }));
  
   
   
    // ÉTAPE A : On supprime les éventuels doublons présents dans notre lot de 100 films
    // En utilisant un Map avec l'ID comme clé, on s'assure de ne garder qu'une seule version de chaque film.
    const uniqueMoviesToInsert = Array.from(new Map(moviesToInsert.map(movie => [movie.id, movie])).values());

    // ÉTAPE B : On utilise .upsert() pour forcer la mise à jour si l'ID existe déjà en base
    // Le deuxième paramètre ["id"] dit explicitement à SQLite : "C'est l'ID qui détermine si le film existe".
    await movieRepository.upsert(uniqueMoviesToInsert, ["id"]);
    
    console.log(`🎬 Succès ! ${moviesToInsert.length} films de TMDB (avec leurs acteurs) ont été copiés dans ta base de données locale !`);

  } catch (error) {
    console.error("❌ Erreur lors de l'importation :", error);
  } finally {
    // 5. On ferme la connexion
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
      console.log("🔌 Connexion fermée.");
    }
  }
};

seedDatabaseFromAPI();
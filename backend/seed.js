import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import axios from 'axios';

export const seedDatabaseFromAPI = async (apiURL) => {
  try {
    // 1. On se connecte à notre base de données locale
    await appDataSource.initialize();
    console.log("✅ Connexion à la base de données réussie !");
    const movieRepository = appDataSource.getRepository(Movie);
    
    // 2. On va chercher les données sur TMDB
    console.log("🌍 Récupération des films depuis TMDB...");
    const response = await axios.get(apiURL, {
      headers: {
        accept: 'application/json',
        // Utilise bien ton propre token ici
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
      }
    });

    const tmdbMovies = response.data.results;

    // 3. On "traduit" les données de TMDB vers notre format (title, year)
    const moviesToInsert = tmdbMovies.map((tmdbMovie) => {
      return {
        title: tmdbMovie.title,
        // On coupe "2014-11-05" pour ne garder que les 4 premiers caractères (2014), qu'on transforme en entier
        year: parseInt(tmdbMovie.release_date.substring(0, 4))
      };
    });

    // 4. On vide l'ancienne table et on insère la nouvelle liste
    await movieRepository.clear();
    await movieRepository.insert(moviesToInsert);
    
    console.log(`🎬 Succès ! ${moviesToInsert.length} films de TMDB ont été copiés dans ta base de données locale !`);

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


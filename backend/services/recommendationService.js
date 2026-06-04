import { appDataSource } from '../datasource.js';

const Movies = appDataSource.getRepository('Movie');
const Ratings = appDataSource.getRepository('Rating');

/**
 * Calcule la similarité cosinus entre deux vecteurs
 * @param {number[]} vec1 - Premier vecteur
 * @param {number[]} vec2 - Deuxième vecteur
 * @returns {number} Similarité entre -1 et 1
 */
function calculateCosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) return 0;

  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Convertit un film en vecteur de caractéristiques
 * Features: [year_normalized, genres..., vote_average_normalized]
 * @param {object} movie - Objet film
 * @param {string[]} allGenres - Liste de tous les genres uniques
 * @returns {number[]} Vecteur du film
 */
function movieToVector(movie, allGenres) {
  const vector = [];

  // 1. Année normalisée (1900-2024)
  const normalizedYear = movie.year ? (movie.year - 1900) / (2024 - 1900) : 0.5;
  vector.push(normalizedYear);

  // 2. One-hot encoding des genres
  const movieGenres = movie.genres || [];
  for (const genre of allGenres) {
    vector.push(movieGenres.includes(genre) ? 1 : 0);
  }

  // 3. Vote average normalisé (0-10 -> 0-1)
  const normalizedVoteAvg = (movie.vote_average || 5) / 10;
  vector.push(normalizedVoteAvg);

  return vector;
}

/**
 * Récupère tous les genres uniques de la BD
 * @returns {Promise<string[]>}
 */
async function getAllGenres() {
  const movies = await Movies.find();
  const genresSet = new Set();

  movies.forEach((movie) => {
    if (movie.genres && Array.isArray(movie.genres)) {
      movie.genres.forEach((g) => genresSet.add(g));
    }
  });

  return Array.from(genresSet).sort();
}

/**
 * Génère les recommandations pour un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {number} limit - Nombre de recommandations (défaut: 5)
 * @returns {Promise<object[]>} Array of {movie, score}
 */
export async function getRecommendations(userId, limit = 5) {
  try {
    // 1. Récupérer les films notés par l'utilisateur avec ses notes
    const userRatings = await Ratings.find({
      where: { user: { id: userId } },
      relations: ['movie'],
    });

    if (userRatings.length === 0) {
      // Pas de notes: recommander les films les mieux notés
      const topMovies = await Movies.find({
        order: { vote_average: 'DESC' },
        take: limit,
      });
      return topMovies.map((movie) => ({
        movie,
        score: movie.vote_average || 0,
        reason: 'Films populaires',
      }));
    }

    // 2. Récupérer tous les films
    const allMovies = await Movies.find();
    const allGenres = await getAllGenres();

    // 3. Créer les vecteurs pour les films notés
    const ratedMovieVectors = userRatings.map((rating) => ({
      movie: rating.movie,
      vector: movieToVector(rating.movie, allGenres),
      rating: rating.note,
    }));

    // 4. Calculer les scores pour chaque film non noté
    const scores = {};
    const ratedMovieIds = new Set(userRatings.map((r) => r.movie.id));

    for (const candidateMovie of allMovies) {
      // Skip films déjà notés par l'utilisateur
      if (ratedMovieIds.has(candidateMovie.id)) continue;

      const candidateVector = movieToVector(candidateMovie, allGenres);
      let totalScore = 0;

      // Somme des similarités pondérées par les notes utilisateur
      for (const { vector: ratedVector, rating } of ratedMovieVectors) {
        const similarity = calculateCosineSimilarity(ratedVector, candidateVector);
        totalScore += similarity * (rating / 5); // Pondérer par note (0-5)
      }

      // Moyenne des scores
      scores[candidateMovie.id] = {
        score: totalScore / ratedMovieVectors.length,
        movie: candidateMovie,
      };
    }

    // 5. Trier par score et retourner top N
    const recommendations = Object.values(scores)
      .filter((item) => item.score > 0) // Filtrer les scores négatifs/nuls
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        movie: item.movie,
        score: item.score.toFixed(3),
      }));

    return recommendations;
  } catch (error) {
    console.error('Erreur dans getRecommendations:', error);
    throw error;
  }
}

/**
 * Obtient les statistiques du système de recommandation
 * Utile pour déboguer
 */
export async function getRecommendationStats() {
  const totalMovies = await Movies.count();
  const totalRatings = await Ratings.count();
  const allGenres = await getAllGenres();

  return {
    totalMovies,
    totalRatings,
    totalGenres: allGenres.length,
    genres: allGenres,
  };
}

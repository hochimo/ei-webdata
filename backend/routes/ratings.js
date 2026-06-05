import axios from 'axios';
import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';

const TMDB_TOKEN = process.env.TMDB_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

const router = express.Router();

async function fetchTmdbMovieDetails(movieId) {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.warn(`TMDB details unavailable for movie ${movieId}:`, error.message);
    return null;
  }
}

/**
 * GET /ratings
 * Récupère la note d'un utilisateur pour un film
 * Query params: ?userId=X&movieId=Y
 */
router.get('/', async function (req, res) {
  try {
    const { userId, movieId } = req.query;

    if (!userId || !movieId) {
      return res.status(400).json({
        message: 'userId et movieId sont requis',
      });
    }

    const ratingRepository = appDataSource.getRepository(Ratings);
    const rating = await ratingRepository.findOne({
      where: {
        user: { id: parseInt(userId, 10) },
        movie: { id: parseInt(movieId, 10) },
      },
    });

    if (!rating) {
      return res.status(404).json({
        message: 'Aucune note trouvée pour ce couple utilisateur-film',
        rating: null,
      });
    }

    res.json({
      message: 'Note trouvée',
      rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la note' });
  }
});

/**
 * POST /ratings
 * Crée ou met à jour une note d'un utilisateur pour un film
 * Body: { user_id, movie_id, note }
 */
router.post('/', async function (req, res) {
  try {
    const { user_id, movie_id, note } = req.body;

    if (!user_id || !movie_id || note === undefined) {
      return res.status(400).json({
        message: 'user_id, movie_id et note sont requis',
      });
    }

    const userId = parseInt(user_id, 10);
    const movieId = parseInt(movie_id, 10);

    if (Number.isNaN(userId) || Number.isNaN(movieId)) {
      return res.status(400).json({
        message: 'user_id et movie_id doivent être des nombres valides',
      });
    }

    const ratingRepository = appDataSource.getRepository(Ratings);
    const userRepository = appDataSource.getRepository('User');
    const movieRepository = appDataSource.getRepository('Movie');

    const userExists = await userRepository.findOne({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    let movieExists = await movieRepository.findOne({ where: { id: movieId } });
    if (!movieExists) {
      const tmdbDetails = await fetchTmdbMovieDetails(movieId);
      const movieData = {
        id: movieId,
        title: tmdbDetails?.title || `Film #${movieId}`,
        year: tmdbDetails?.release_date
          ? parseInt(tmdbDetails.release_date.substring(0, 4), 10)
          : null,
        synopsis: tmdbDetails?.overview || null,
        poster_path: tmdbDetails?.poster_path || null,
        runtime: tmdbDetails?.runtime || null,
        genres: tmdbDetails?.genres
          ? tmdbDetails.genres.map((genre) => genre.name)
          : null,
        vote_average: tmdbDetails?.vote_average || null,
        vote_count: tmdbDetails?.vote_count || null,
      };
      movieExists = movieRepository.create(movieData);
      await movieRepository.save(movieExists);
    }

    // Chercher une note existante
    const existingRating = await ratingRepository.findOne({
      where: {
        user: { id: userId },
        movie: { id: movieId },
      },
    });

    let savedRating;
    if (existingRating) {
      existingRating.note = note;
      savedRating = await ratingRepository.save(existingRating);
      return res.status(200).json({
        message: 'Note mise à jour avec succès',
        rating: savedRating,
      });
    }

    const newRating = ratingRepository.create({
      movie: { id: movieId },
      user: { id: userId },
      note,
    });

    savedRating = await ratingRepository.save(newRating);
    return res.status(201).json({
      message: 'Note créée avec succès',
      rating: savedRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la note' });
  }
});

export default router;

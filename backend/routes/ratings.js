import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';

const router = express.Router();

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

    const ratingRepository = appDataSource.getRepository(Ratings);

    // Chercher une note existante
    const existingRating = await ratingRepository.findOne({
      where: {
        user: { id: user_id },
        movie: { id: movie_id },
      },
    });

    let savedRating;
    if (existingRating) {
      // Mise à jour
      existingRating.note = note;
      savedRating = await ratingRepository.save(existingRating);
      return res.status(200).json({
        message: 'Note mise à jour avec succès',
        rating: savedRating,
      });
    } else {
      // Création
      const newRating = ratingRepository.create({
        movie: { id: movie_id },
        user: { id: user_id },
        note,
      });

      savedRating = await ratingRepository.save(newRating);
      return res.status(201).json({
        message: 'Note créée avec succès',
        rating: savedRating,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde de la note' });
  }
});

export default router;

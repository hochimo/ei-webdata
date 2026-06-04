import express from 'express';
import { getRecommendations, getRecommendationStats } from '../services/recommendationService.js';

const router = express.Router();

/**
 * GET /recommendations/:userId
 * Retourne les recommandations de films pour un utilisateur
 * Query params: ?limit=5 (défaut: 5)
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const limit = Math.min(parseInt(req.query.limit || 5, 10), 20); // Max 20

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        error: 'Invalid userId',
        message: 'userId doit être un entier positif',
      });
    }

    const recommendations = await getRecommendations(userId, limit);

    res.json({
      userId,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /recommendations/stats
 * Retourne des statistiques sur le système de recommandation
 */
router.get('/stats/info', async (req, res, next) => {
  try {
    const stats = await getRecommendationStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;

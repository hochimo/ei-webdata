import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';

const router = express.Router();

router.post('/', function (req, res) {
  const ratingRepository = appDataSource.getRepository(Ratings);
  const newRating = ratingRepository.create({
    movie_id: req.body.movie_id,
    user_id: req.body.user_id,
    note: req.body.note,
  });

  ratingRepository
    .save(newRating)
    .then(function (savedRating) {
      res.status(201).json({
        message: 'Rating successfully created',
        rating: savedRating,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while creating the rating' });
    });
});

export default router;

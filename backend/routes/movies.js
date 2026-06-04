import express from 'express';
import { appDataSource } from '../datasource.js';
import Movies from '../entities/Movies.js';
import Ratings from '../entities/ratings.js';


const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movies)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching movies' });
    });
});

router.get('/:movie_id', function (req, res) {
  appDataSource
    .getRepository(Movies)
    .findOne({ where: { movie_id: parseInt(req.params.movie_id) } })
    .then(function (movie) {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: 'Movie not found' });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching the movie' });
    });
});

router.get('/:movie_id/ratings', function (req, res) {
  appDataSource
    .getRepository(Ratings)
    .find({
  relations: {
    movie: true,
    user: true
  },
  where: {
    movie: { movie_id: parseInt(req.params.movie_id) }
  }
})
    .then(function (rating) {
      if (rating) {
        res.json(rating);
      } else {
        res.status(404).json({ message: 'Rating not found' });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching the rating' });
    });
});

router.delete('/:id', function (req, res) {
  appDataSource
    .getRepository(Movies)
    .findOne({ where: { id: parseInt(req.params.id) } })
    .then(function (movie) {
      if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
        return;
      }
      appDataSource
        .getRepository(Movies)
        .delete({ id: parseInt(req.params.id) })
        .then(function () {
          res.status(200).json({ message: 'Movie successfully deleted' });
        })
        .catch(function (error) {
          console.error(error);
          res.status(500).json({ message: 'Error while deleting the movie' });
        });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while checking the movie' });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movies);
  const newMovie = movieRepository.create({
    title: req.body.title || 'Untitled movie',
    year: req.body.year,
  });

  movieRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        movie: savedMovie,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while creating the movie' });
    });
});

export default router;

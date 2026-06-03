import express from 'express';
import { appDataSource } from '../datasource.js';
import Movies from '../entities/Movies.js';

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

router.get('/:id', function (req, res) {
  appDataSource
    .getRepository(Movies)
    .findOne({ where: { id: parseInt(req.params.id) } })
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

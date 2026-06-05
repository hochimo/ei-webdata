import express from 'express';
import axios from 'axios';
import { appDataSource } from '../datasource.js';
import Movies from '../entities/Movies.js';
import Ratings from '../entities/ratings.js';


const router = express.Router();
let posterColumnEnsured = false;

async function ensurePosterColumnExists() {
  if (posterColumnEnsured) {
    return;
  }

  const columns = await appDataSource.query("PRAGMA table_info('movie')");
  const hasPoster = columns.some((col) => col.name === 'poster_path');
  if (!hasPoster) {
    await appDataSource.query('ALTER TABLE movie ADD COLUMN poster_path TEXT');
  }

  posterColumnEnsured = true;
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function fetchMovieDetails(movie, token) {
  try {
    const resp = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = resp.data || {};
    return {
      ...movie,
      poster_path: data.poster_path || null,
      release_date: data.release_date || null,
    };
  } catch (err) {
    console.warn(`TMDB enrichment failed for movie ${movie.id}:`, err.message);
    return { ...movie, poster_path: null };
  }
}

async function enrichMoviesWithPosters(movies) {
  const TMDB_TOKEN = process.env.TMDB_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';
  const movieRepository = appDataSource.getRepository(Movies);
  const missingPosters = movies.filter((movie) => !movie.poster_path);
  const chunks = chunkArray(missingPosters, 10);
  const updatedMovies = [...movies];

  for (const chunk of chunks) {
    const results = await Promise.allSettled(chunk.map((movie) => fetchMovieDetails(movie, TMDB_TOKEN)));
    for (let index = 0; index < results.length; index += 1) {
      const result = results[index];
      const movie = chunk[index];
      if (result.status === 'fulfilled') {
        const enriched = result.value;
        const originalIndex = updatedMovies.findIndex((m) => m.id === movie.id);
        if (originalIndex !== -1) {
          updatedMovies[originalIndex] = enriched;
        }
        if (enriched.poster_path) {
          try {
            await movieRepository.update({ id: enriched.id }, { poster_path: enriched.poster_path });
          } catch (err) {
            console.warn(`Unable to cache poster_path for movie ${enriched.id}:`, err.message);
          }
        }
      }
    }
  }

  return updatedMovies;
}

router.get('/', async function (req, res) {
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 200);
  const take = Number.isNaN(limit) ? 100 : limit;

  try {
    await ensurePosterColumnExists();
    const movies = await appDataSource.getRepository(Movies).find({ take, order: { vote_average: 'DESC' } });
    const enriched = await enrichMoviesWithPosters(movies);
    return res.json({ movies: enriched });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while fetching movies' });
  }
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
    movie: { id: parseInt(req.params.movie_id) }
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

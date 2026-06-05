import { appDataSource } from './datasource.js';

async function main() {
  await appDataSource.initialize();
  const ratingRepo = appDataSource.getRepository('Rating');
  const movieRepo = appDataSource.getRepository('Movie');
  const ratings = await ratingRepo.find({ relations: ['movie', 'user'] });
  const movies = await movieRepo.find();
  console.log('ratings count', ratings.length);
  console.log('movies count', movies.length);
  console.log('sample ratings', ratings.slice(0, 5).map((r) => ({ id: r.id, note: r.note, user: r.user?.id, movie: r.movie?.id, movieTitle: r.movie?.title })));
  console.log('sample movies', movies.slice(0, 5).map((m) => ({ id: m.id, title: m.title, genres: m.genres, year: m.year })));
  await appDataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

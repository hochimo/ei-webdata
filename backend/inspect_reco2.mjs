import { appDataSource } from './datasource.js';

const USER_ID = 1;

async function main() {
  await appDataSource.initialize();
  const ratingRepo = appDataSource.getRepository('Rating');
  const movieRepo = appDataSource.getRepository('Movie');
  const userRatings = await ratingRepo.find({ where: { user: { id: USER_ID } }, relations: ['movie', 'user'] });
  const allMovies = await movieRepo.find();

  const ratedMovieIds = new Set(userRatings.map((r) => r.movie?.id).filter((id) => id != null));
  const unratedMovies = allMovies.filter((m) => !ratedMovieIds.has(m.id));

  console.log('userId', USER_ID);
  console.log('ratings count', userRatings.length);
  console.log('movies count', allMovies.length);
  console.log('unique rated movie ids', ratedMovieIds.size);
  console.log('unrated movie count', unratedMovies.length);
  console.log('unrated sample', unratedMovies.slice(0, 10).map((m) => ({ id: m.id, title: m.title })));

  await appDataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

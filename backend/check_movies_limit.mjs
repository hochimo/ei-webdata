import { appDataSource } from './datasource.js';

async function main() {
  await appDataSource.initialize();
  const movieRepo = appDataSource.getRepository('Movie');
  const movies = await movieRepo.find({ take: 100, order: { vote_average: 'DESC' } });
  console.log('movies fetched', movies.length);
  console.log('sample', movies.slice(0,5).map(m=>({id:m.id,title:m.title,year:m.year})));
  await appDataSource.destroy();
}

main().catch(e=>{console.error(e); process.exit(1);});

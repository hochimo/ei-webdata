import { getRecommendations } from './services/recommendationService.js';

async function main() {
  const recs = await getRecommendations(1, 5);
  console.log('recommendations count', recs.length);
  console.log('recommendations sample', recs.slice(0, 5).map((r) => ({ id: r.movie.id, title: r.movie.title, score: r.score, reason: r.reason })));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

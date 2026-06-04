import typeorm from 'typeorm';

const Movies = new typeorm.EntitySchema({
  name: 'Movie',
  tableName: 'movie',
  columns: {
    movie_id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
    },
    year: {
      type: Number,
      nullable: true,
    },

    synopsis: {
      type: String,
      nullable: true,
    },
    genres : {
      type: 'simple-array',
      nullable: true,
    },
    vote_average:{ type: 'float', nullable: true },
    vote_count:{ type: 'float', nullable: true },

  },
  relations: {    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'movie'}},
});

export default Movies;

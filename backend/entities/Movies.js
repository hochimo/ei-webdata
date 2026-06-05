import typeorm from 'typeorm';

const Movies = new typeorm.EntitySchema({
  name: 'Movie',
  tableName: 'movie',
  columns: {
    id: {
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
    poster_path: {
      type: String,
      nullable: true,
    },
    genres : {
      type: 'simple-array',
      nullable: true,
    },
    vote_average:{ type: 'float', nullable: true },
    vote_count:{ type: 'float', nullable: true },
    actors:{      type: 'simple-array',      nullable: true,  },

  },
  relations: {    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'movie'}},
});

export default Movies;

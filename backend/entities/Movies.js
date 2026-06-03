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
  },
});

export default Movies;

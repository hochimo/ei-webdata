import typeorm from 'typeorm';

const Ratings = new typeorm.EntitySchema({
  name: 'Rating',
  tableName: 'rating',
  columns: {

    rating_id: {
      primary: true,
      type: Number,
      generated: true,
    },

    note: {
      type: 'float',

    },
  },
    
    }
);
    

export default Ratings;

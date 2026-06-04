import typeorm from 'typeorm';

const Ratings = new typeorm.EntitySchema({
  name: 'Rating',
  tableName: 'rating',
  columns: {

    id: {
      primary: true,
      type: Number,
      generated: true,
    },

    note: {
      type: 'float',

    },
  },

  relations: {
        user: {
            target: "User", // Doit correspondre au nom de ton entité Utilisateur
            type: "many-to-one",
            joinColumn: { 
                name: "user_id" // Force le nom de la clé étrangère demandée
            },
            inverseSide: "ratings", // Fait le lien avec la relation dans l'entité User
            nullable: false, // Assure que chaque note est liée à un utilisateur
            onDelete: "CASCADE" // Optionnel : supprime la note si l'utilisateur est supprimé
        },
        movie: {
            target: "Movie", // Doit correspondre au nom de ton entité Film
            type: "many-to-one",
            joinColumn: { 
                name: "movie_id" // Force le nom de la clé étrangère demandée
            },
            inverseSide: "ratings",
            nullable: false, // Assure que chaque note est liée à un film
            onDelete: "CASCADE" // Optionnel : supprime la note si le film est supprimé
        }
    }
    
    }
);
    

export default Ratings;

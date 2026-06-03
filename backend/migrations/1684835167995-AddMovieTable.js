import typeorm from 'typeorm';

const { MigrationInterface, QueryRunner } = typeorm;

export default class AddMovieTable1684835167995 {
  name = 'AddMovieTable1684835167995'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" integer
            )
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            DROP TABLE "movie"
        `);
  }
}

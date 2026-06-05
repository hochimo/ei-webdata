/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddMovieRuntime20260605120000 {
  name = 'AddMovieRuntime20260605120000'

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "movie" ADD COLUMN "runtime" integer`);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "movie" RENAME TO "temporary_movie"`);
    await queryRunner.query(`
      CREATE TABLE "movie" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" varchar NOT NULL,
        "year" integer,
        "synopsis" varchar,
        "poster_path" varchar,
        "genres" text,
        "vote_average" float,
        "vote_count" float,
        "actors" text
      )
    `);
    await queryRunner.query(`
      INSERT INTO "movie"("id", "title", "year", "synopsis", "poster_path", "genres", "vote_average", "vote_count", "actors")
      SELECT "id", "title", "year", "synopsis", "poster_path", "genres", "vote_average", "vote_count", "actors"
      FROM "temporary_movie"
    `);
    await queryRunner.query(`DROP TABLE "temporary_movie"`);
  }
}

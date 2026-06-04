/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class  $npmConfigName1780564832022 {
    name = ' $npmConfigName1780564832022'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "note" float NOT NULL,
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" integer,
                "synopsis" varchar,
                "genres" text,
                "vote_average" float,
                "vote_count" float
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("id", "title", "year")
            SELECT "id",
                "title",
                "year"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_rating" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "note" float NOT NULL,
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_a6341c958bc0027bfb37b0f98a4" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_rating"("id", "note", "user_id", "movie_id")
            SELECT "id",
                "note",
                "user_id",
                "movie_id"
            FROM "rating"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_rating"
                RENAME TO "rating"
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "rating"
                RENAME TO "temporary_rating"
        `);
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "note" float NOT NULL,
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "rating"("id", "note", "user_id", "movie_id")
            SELECT "id",
                "note",
                "user_id",
                "movie_id"
            FROM "temporary_rating"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "year" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("id", "title", "year")
            SELECT "id",
                "title",
                "year"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
    }
}

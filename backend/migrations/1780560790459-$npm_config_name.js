/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class  $npmConfigName1780560790459 {
    name = ' $npmConfigName1780560790459'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "rating_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "note" float NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" ("title" varchar NOT NULL, "year" integer)
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("title", "year")
            SELECT "title",
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
            CREATE TABLE "temporary_movie" (
                "title" varchar NOT NULL,
                "year" integer,
                "movie_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "synopsis" varchar,
                "genres" text,
                "vote_average" float,
                "vote_count" float
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("title", "year")
            SELECT "title",
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
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" ("title" varchar NOT NULL, "year" integer)
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("title", "year")
            SELECT "title",
                "year"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
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
            INSERT INTO "movie"("title", "year")
            SELECT "title",
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

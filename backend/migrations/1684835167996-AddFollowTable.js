import typeorm from 'typeorm';

const { MigrationInterface, QueryRunner } = typeorm;

export default class AddFollowTable1684835167996 {
  name = 'AddFollowTable1684835167996'

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "follow" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "followerId" integer NOT NULL,
                "followedId" integer NOT NULL,
                CONSTRAINT "UQ_follow_follower_followed" UNIQUE ("followerId", "followedId")
            )
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            DROP TABLE "follow"
        `);
  }
}

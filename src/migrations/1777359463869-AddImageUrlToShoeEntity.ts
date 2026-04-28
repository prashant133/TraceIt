import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToShoeEntity1777359463869 implements MigrationInterface {
    name = 'AddImageUrlToShoeEntity1777359463869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shoes" ADD "fileUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shoes" DROP COLUMN "fileUrl"`);
    }

}

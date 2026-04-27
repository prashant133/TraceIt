import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShoeTableAndPurchaseTable1777285014599 implements MigrationInterface {
    name = 'AddShoeTableAndPurchaseTable1777285014599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shoes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "modelNumber" character varying NOT NULL, "brand" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "manufactureAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "createdById" uuid, CONSTRAINT "UQ_a33eca39ac302a0b62234c19050" UNIQUE ("modelNumber"), CONSTRAINT "PK_5367569fb93ba8de671a6890aae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "purchaseAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "shoeId" uuid, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shoes" ADD CONSTRAINT "FK_2ce6938ca138f8fa046bddcbad9" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_f9f6c876aa6240c859eafade66b" FOREIGN KEY ("shoeId") REFERENCES "shoes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_f9f6c876aa6240c859eafade66b"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_341f0dbe584866284359f30f3da"`);
        await queryRunner.query(`ALTER TABLE "shoes" DROP CONSTRAINT "FK_2ce6938ca138f8fa046bddcbad9"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "shoes"`);
    }

}

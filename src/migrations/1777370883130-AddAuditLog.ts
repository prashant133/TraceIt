import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditLog1777370883130 implements MigrationInterface {
    name = 'AddAuditLog1777370883130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_enum" AS ENUM('USER_REGISTERED', 'USER_LOGGED_IN', 'USER_LOGGED_OUT', 'EMAIL_VERIFIED', 'PASSWORD_RESET', 'REFRESH_TOKEN', 'GET_CURRENT_USER', 'SHOE_CREATED', 'SHOE_UPDATED', 'SHOE_DELETED', 'SHOE_VIEWED', 'SHOE_PURCHASED')`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."audit_logs_action_enum" NOT NULL, "entity" character varying NOT NULL, "entityId" character varying, "metadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "performedById" uuid, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_371007aca0b12c07d6d2dbdb83a" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_371007aca0b12c07d6d2dbdb83a"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_enum"`);
    }

}

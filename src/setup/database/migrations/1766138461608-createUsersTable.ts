import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1766138461608 implements MigrationInterface {
    name = 'CreateUsersTable1766138461608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255), "name" character varying(100), "password_hash" character varying(255), "password_reset_token" character varying(255), "password_reset_expires" TIMESTAMP, "provider" character varying(100), "social_id" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_24ed31edd4e42499a687467fdc4" UNIQUE ("social_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1778686172238 implements MigrationInterface {
    name = 'Tables1778686172238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "GeoLocation"`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "image_name"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "image_name" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "url_image"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "url_image" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "url_map"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "url_map" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "tax_info"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "tax_info" nvarchar(MAX)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "tax_info"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "tax_info" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "url_map"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "url_map" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "url_image"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "url_image" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "image_name"`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "image_name" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD "GeoLocation" geography`);
    }

}

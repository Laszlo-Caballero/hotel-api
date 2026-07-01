import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1778685645471 implements MigrationInterface {
    name = 'Tables1778685645471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotel" ("hotelId" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "location" nvarchar(255), "price_per_night" decimal(10,2), "nights" int, "persons" int, "ranking" nvarchar(255) NOT NULL, "lat" nvarchar(255), "lng" nvarchar(255), "image_name" nvarchar(255), "url_image" nvarchar(255), "url_map" nvarchar(255), "tax_info" nvarchar(255), CONSTRAINT "PK_0a87269c861e07eb18270b8191a" PRIMARY KEY ("hotelId"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" int NOT NULL IDENTITY(1,1), "num_persons" int NOT NULL, "price_per_night" decimal(10,2) NOT NULL, "tax" nvarchar(255) NOT NULL, "beds" ntext NOT NULL, "services" ntext NOT NULL, "tags" ntext NOT NULL, "hotelHotelId" int, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservas" ("reservaId" int NOT NULL IDENTITY(1,1), "hotelId" int NOT NULL, "guestName" nvarchar(255) NOT NULL, "guestEmail" nvarchar(255) NOT NULL, "checkIn" date NOT NULL, "checkOut" date NOT NULL, "numPersons" int NOT NULL, "typeRoom" nvarchar(255) NOT NULL, "totalPrice" decimal(10,2) NOT NULL, "nights" int NOT NULL, "status" nvarchar(50) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_98ecbeff11f8bf906b485797fe1" DEFAULT getdate(), CONSTRAINT "PK_d1b3305ab7b340ac9384b0782c3" PRIMARY KEY ("reservaId"))`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_57731c90075844dfb7573811eae" FOREIGN KEY ("hotelHotelId") REFERENCES "hotel"("hotelId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_57731c90075844dfb7573811eae"`);
        await queryRunner.query(`DROP TABLE "reservas"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "hotel"`);
    }

}

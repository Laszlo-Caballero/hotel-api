import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HotelModule } from "./hotel/hotel.module";
import { Hotel } from "./hotel/entities/hotel.entity";
import { Reserva } from "./hotel/entities/reserva.entity";
import { ConfigModule } from "@nestjs/config";
import { Rooms } from "./hotel/entities/rooms.entity";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mssql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "1433"),
      username: "usersql",
      password: process.env.DB_PASSWORD || "123",
      database: process.env.DB_NAME || "hotel",
      entities: [Hotel, Reserva, Rooms],
      synchronize: false,
      extra: {
        trustServerCertificate: true,
        encrypt: process.env.DB_ENCRYPT === "true" || false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "static"),
      serveRoot: "/static",
    }),
    HotelModule,
  ],
})
export class AppModule {}

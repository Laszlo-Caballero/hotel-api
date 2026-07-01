import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

// ─── GET /hotel?limit=10&page=1 ──────────────────────────────────────────────
export class PaginationDto {
  @ApiProperty({ example: 1, description: "Número de página" })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, description: "Cantidad de elementos por página" })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;
}

// ─── GET /hotel/cercanos?lat=XXX&lng=XXX ────────────────────────────────────
export class NearbyHotelsDto {
  @ApiProperty({ example: -12.046374, description: "Latitud" })
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -77.042793, description: "Longitud" })
  @Type(() => Number)
  @IsNumber()
  lng: number;

  @ApiProperty({
    required: false,
    example: 2000,
    description: "Radio de búsqueda en metros",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  distance?: number = 2000; // metros, default 2km
}

// ─── POST /hotel/reservar ────────────────────────────────────────────────────
export class ReservarHotelDto {
  @ApiProperty({ example: 1, description: "ID del hotel" })
  @IsNumber()
  hotelId: number;

  @ApiProperty({ example: "John Doe", description: "Nombre del huésped" })
  @IsString()
  guestName: string;

  @ApiProperty({
    example: "john@example.com",
    description: "Email del huésped",
  })
  @IsString()
  guestEmail: string;

  @ApiProperty({
    example: "2024-06-01",
    description: "Fecha de entrada (YYYY-MM-DD)",
  })
  @IsString()
  checkIn: string; // YYYY-MM-DD

  @ApiProperty({
    example: "2024-06-05",
    description: "Fecha de salida (YYYY-MM-DD)",
  })
  @IsString()
  checkOut: string; // YYYY-MM-DD

  @ApiProperty({
    required: false,
    example: 2,
    description: "Número de personas",
  })
  @IsOptional()
  @IsNumber()
  numPersons?: number = 1;

  @ApiProperty({
    required: false,
    example: "Doble",
    description: "Tipo de habitación",
  })
  @IsOptional()
  @IsString()
  typeRoom?: string;
}

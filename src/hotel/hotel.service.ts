import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Hotel } from "./entities/hotel.entity";
import { Reserva } from "./entities/reserva.entity";
import {
  PaginationDto,
  NearbyHotelsDto,
  ReservarHotelDto,
} from "./dto/hotel.dto";

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── GET /hotel?limit=10&page=1 ─────────────────────────────────────────
  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const [data, total] = await this.hotelRepository.findAndCount({
      order: { hotelId: "ASC" },
      skip: offset,
      take: limit,
      relations: {
        rooms: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  // ─── GET /hotel/cercanos?lat=XXX&lng=XXX ─────────────────────────────────
  async findNearby(query: NearbyHotelsDto) {
    const { lat, lng, distance = 2000 } = query;

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new BadRequestException("Coordenadas inválidas");
    }

    // Usa el stored procedure find_by_distance con TypeORM
    const result = await this.dataSource.query(
      `EXEC find_by_distance @Distance=@0, @LAT=@1, @LNG=@2`,
      [distance, lat.toString(), lng.toString()],
    );

    return {
      data: result,
      meta: {
        lat,
        lng,
        distanceMeters: distance,
        total: result.length,
      },
    };
  }

  // ─── POST /hotel/reservar ─────────────────────────────────────────────────
  async reservar(dto: ReservarHotelDto) {
    const {
      hotelId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      numPersons = 1,
      typeRoom,
    } = dto;

    // Verificar que el hotel existe
    const hotel = await this.hotelRepository.findOne({
      where: { hotelId },
      select: ["hotelId", "name", "price_per_night"],
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel con id ${hotelId} no encontrado`);
    }

    // Calcular noches
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      throw new BadRequestException(
        "La fecha de check-out debe ser posterior al check-in",
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = hotel.price_per_night * nights;

    // Insertar reserva usando TypeORM
    const newReserva = this.reservaRepository.create({
      hotelId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      numPersons,
      typeRoom: typeRoom || "Habitación Estándar",
      totalPrice,
      nights,
      status: "CONFIRMADA",
    });

    const savedReserva = await this.reservaRepository.save(newReserva);

    this.logger.log(
      `✅ Reserva creada: ID ${savedReserva.reservaId} - Hotel: ${hotel.name}`,
    );

    return {
      message: "Reserva creada exitosamente",
      data: {
        reservaId: savedReserva.reservaId,
        hotel: hotel.name,
        hotelId,
        guestName,
        guestEmail,
        checkIn,
        checkOut,
        nights,
        numPersons,
        typeRoom: typeRoom || "Habitación Estándar",
        pricePerNight: hotel.price_per_night,
        totalPrice,
        status: "CONFIRMADA",
        createdAt:
          savedReserva.createdAt?.toISOString() || new Date().toISOString(),
      },
    };
  }
}

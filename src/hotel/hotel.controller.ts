import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { PaginationDto, NearbyHotelsDto, ReservarHotelDto } from './dto/hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  /**
   * GET /hotel?limit=10&page=1
   * Lista paginada de hoteles
   */
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.hotelService.findAll(pagination);
  }

  /**
   * GET /hotel/cercanos?lat=XXXX&lng=XXX
   * Hoteles cercanos usando geolocalización y stored procedure find_by_distance
   */
  @Get('cercanos')
  findNearby(@Query() query: NearbyHotelsDto) {
    return this.hotelService.findNearby(query);
  }

  /**
   * POST /hotel/reservar
   * Registra una reserva básica de hotel
   */
  @Post('reservar')
  @HttpCode(HttpStatus.CREATED)
  reservar(@Body() dto: ReservarHotelDto) {
    return this.hotelService.reservar(dto);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel } from './entities/hotel.entity';
import { Reserva } from './entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Reserva])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}

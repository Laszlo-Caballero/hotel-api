import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'reservaId' })
  reservaId: number;

  @Column({ name: 'hotelId' })
  hotelId: number;

  @Column({ name: 'guestName', length: 255 })
  guestName: string;

  @Column({ name: 'guestEmail', length: 255 })
  guestEmail: string;

  @Column('date')
  checkIn: Date;

  @Column('date')
  checkOut: Date;

  @Column()
  numPersons: number;

  @Column({ name: 'typeRoom', length: 255 })
  typeRoom: string;

  @Column('decimal', { name: 'totalPrice', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  nights: number;

  @Column({ length: 50 })
  status: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}

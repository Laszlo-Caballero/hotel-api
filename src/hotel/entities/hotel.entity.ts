import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Rooms } from "./rooms.entity";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  hotelId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column("decimal", {
    name: "price_per_night",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  price_per_night: number;

  @Column({ nullable: true })
  nights: number;

  @Column({ nullable: true })
  persons: number;

  @Column()
  ranking: string;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ name: "image_name", nullable: true, length: "MAX" })
  image_name: string;

  @Column({ name: "url_image", nullable: true, length: "MAX" })
  url_image: string;

  @Column({ name: "url_map", nullable: true, length: "MAX" })
  url_map: string;

  @Column({ name: "tax_info", nullable: true, length: "MAX" })
  tax_info: string;

  @OneToMany(() => Rooms, (room) => room.hotel)
  rooms: Rooms[];
}

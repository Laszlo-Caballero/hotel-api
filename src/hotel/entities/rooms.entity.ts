import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
} from "typeorm";
import { Hotel } from "./hotel.entity";

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  num_persons: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price_per_night: number;
  @Column()
  tax: string;
  @Column("simple-json")
  beds: string[];
  @Column("simple-json")
  services: string[];
  @Column("simple-json")
  tags: string[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Relation<Hotel>;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // password: string;

  @Column()
  name: string;

  // @Column()
  // role: string;
}

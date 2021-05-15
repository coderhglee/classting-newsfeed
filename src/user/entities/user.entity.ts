import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  @Column('simple-array')
  roles: string[];

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

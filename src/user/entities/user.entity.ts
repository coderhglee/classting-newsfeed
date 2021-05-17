import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
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

  comparePassword(inputPassword: string) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

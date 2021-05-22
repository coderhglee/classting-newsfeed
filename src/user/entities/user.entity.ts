import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/base/entity/base.entity';

export const USER_ENTITY = 'user';

@Entity(USER_ENTITY)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
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
    super();
    Object.assign(this, partial);
  }
}

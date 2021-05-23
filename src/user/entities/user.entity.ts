import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/base/entity/base.entity';

export const USER_ENTITY = 'user';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

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

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  comparePassword(inputPassword: string) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

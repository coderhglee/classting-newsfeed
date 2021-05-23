import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deleteAt: Date;
}

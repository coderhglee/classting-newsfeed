import { BaseEntity } from '../../base/entity/base.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Page } from '../../page/entities/page.entity';

@Unique(['user', 'page'])
@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Page)
  @JoinColumn()
  page: Page;

  constructor(partial: Partial<Subscription>) {
    super();
    Object.assign(this, partial);
  }
}

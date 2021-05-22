import { BaseEntity } from 'src/base/entity/base.entity';
import { Page } from 'src/page/entities/page.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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

import { BaseEntity } from 'src/base/entity/base.entity';
import { Page, PAGE_ENTITY } from 'src/page/entities/page.entity';
import { User, USER_ENTITY } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export const SUBSCRIPTION_ENTITY = 'subscription';

@Unique([USER_ENTITY, PAGE_ENTITY])
@Entity(SUBSCRIPTION_ENTITY)
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

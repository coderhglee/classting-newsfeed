import { Page } from '../../page/entities/page.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base/entity/base.entity';

export const POST_ENTITY = 'post';

@Entity(POST_ENTITY)
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  context: string;

  @ManyToOne(() => Page, (page) => page.posts)
  page: Page;

  constructor(partial: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }
}

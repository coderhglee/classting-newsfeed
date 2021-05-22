import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

export const PAGE_ENTITY = 'page';

@Entity(PAGE_ENTITY)
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @OneToMany(() => Post, (post) => post.page)
  posts: Promise<Post[]>;

  constructor(partial: Partial<Page>) {
    Object.assign(this, partial);
  }

  isPageOwner(id: string) {
    if (this.ownerId === id) {
      return true;
    }
    return false;
  }
}

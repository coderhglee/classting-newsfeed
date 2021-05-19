import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  name: string;

  @Column()
  region: string;

  @OneToMany(() => Post, (post) => post.page)
  posts: Promise<Post[]>;

  constructor(partial: Partial<Page>) {
    Object.assign(this, partial);
  }

  isPageOwner(id: number) {
    if (this.ownerId === id) {
      return true;
    }
    return false;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(partial: Partial<Page>) {
    Object.assign(this, partial);
  }
}

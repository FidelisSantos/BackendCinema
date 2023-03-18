import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false, length: '1000' })
  imageLink: string;

  @Column({ nullable: false, length: '10000' })
  description: string;

  @Column({ nullable: false })
  movieTime: number;

  @Column({ nullable: false })
  classification: string;

  @ManyToMany(() => Tag, { eager: true, nullable: false })
  @JoinTable({
    name: 'movieTags',
    synchronize: true,
  })
  tags: Tag[];
}

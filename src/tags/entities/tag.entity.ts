import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  id: number;

  @Column()
  tag: string;
}

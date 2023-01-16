import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class Filme {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, unique: true })
  titulo: string;

  @Column({ nullable: false, length: '1000' })
  linkImagem: string;

  @Column({ nullable: false, length: '10000' })
  descricao: string;

  @Column({ nullable: false })
  tempoDeFilme: number;

  @Column({ nullable: false })
  classificacao: string;

  @ManyToMany(() => Tag, { eager: true, nullable: false })
  @JoinTable({
    name: 'filmeTags',
    synchronize: true,
  })
  tags: Tag[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sala } from '../../sala/entities/sala.entity';
import { Filme } from '../../filme/entities/filme.entity';
import { StatusSessaoEnum } from '../enum/status-sessao.enum';

@Entity()
export class Sessao {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  id: number;

  @ManyToOne<Sala>(() => Sala, (sala) => sala.id)
  @JoinColumn({
    name: 'salaId',
  })
  sala: Sala;

  @ManyToOne<Filme>(() => Filme, (filme) => filme.id)
  @JoinColumn({ name: 'filmeId' })
  filme: Filme;

  @Column({ nullable: false })
  init: Date;

  @Column({ nullable: false })
  finish: Date;

  @Column({ nullable: false, default: StatusSessaoEnum.WAITING })
  status: StatusSessaoEnum;
}

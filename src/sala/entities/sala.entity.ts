import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusSalaEnum } from '../enum/status-sala.enum';

@Entity()
export class Sala {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: StatusSalaEnum.FREE })
  status: StatusSalaEnum;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEnum } from '../enum/status.Enum';

@Entity()
export class Sala {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: StatusEnum.FREE })
  status: StatusEnum;

  @Column({ default: 0, nullable: true })
  sessaoId: number;
}

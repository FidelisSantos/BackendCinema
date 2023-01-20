import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusRoomEnum } from '../enum/status-room.enum';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, default: StatusRoomEnum.FREE })
  status: StatusRoomEnum;
}

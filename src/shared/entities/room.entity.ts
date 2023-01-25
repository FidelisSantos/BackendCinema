import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusRoomEnum } from '../../rooms/enum/status-room.enum';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, default: StatusRoomEnum.FREE })
  status: StatusRoomEnum;
}

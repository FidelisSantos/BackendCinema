import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Movie } from './movie.entity';
import { StatusSessionEnum } from '../../sessions/enum/status-session.enum';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  id: number;

  @ManyToOne<Room>(() => Room, (room) => room.id)
  @JoinColumn({
    name: 'roomId',
  })
  room: Room;

  @ManyToOne<Movie>(() => Movie, (movie) => movie.id)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ nullable: false })
  init: Date;

  @Column({ nullable: false })
  finish: Date;

  @Column({ nullable: false, default: StatusSessionEnum.WAITING })
  status: StatusSessionEnum;
}

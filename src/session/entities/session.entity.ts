import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { StatusSessionEnum } from '../enum/status-session.enum';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  id: number;

  @ManyToOne<Room>(() => Room, (room) => room.id)
  @JoinColumn({
    name: 'roomId',
  })
  sala: Room;

  @ManyToOne<Movie>(() => Movie, (movie) => movie.id)
  @JoinColumn({ name: 'movieId' })
  filme: Movie;

  @Column({ nullable: false })
  init: Date;

  @Column({ nullable: false })
  finish: Date;

  @Column({ nullable: false, default: StatusSessionEnum.WAITING })
  status: StatusSessionEnum;
}

import { Movie } from '../../shared/entities/movie.entity';
import { SessionType } from './sessionType';

export class MovieSessions {
  movie: Movie;
  sessions: SessionType[];
}

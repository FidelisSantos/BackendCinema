import { Movie } from '../../shared/entities/movie.entity';
import { SessionType } from './sessionType';

export class MovieSessions {
  filme: Movie;
  sessoes: SessionType[];
}

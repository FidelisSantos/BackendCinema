import { SessaoType } from './SessaoType';
import { Movie } from '../../movies/entities/movie.entity';

export class FilmeSessao {
  filme: Movie;
  sessoes: SessaoType[];
}

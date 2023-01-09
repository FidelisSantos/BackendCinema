import { SessaoType } from './SessaoType';
import { Filme } from '../../filme/entities/filme.entity';

export class FilmeSessao {
  filme: Filme;
  sessoes: SessaoType[];
}

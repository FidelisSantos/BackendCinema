import { Injectable } from '@nestjs/common';
import { SessaoType } from 'src/sessao/types/SessaoType';
import { FilmeSessao } from 'src/sessao/types/filmeSessao';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';

@Injectable()
export class FilmeSessaoService {
  constructor(private sessaoRepository: SessaoRepositoryService) {}

  async findFilmeSessoes() {
    const sessoes = await this.sessaoRepository.findAll();
    const filmeSessoes: FilmeSessao[] = [];
    for (let i = 0; i < sessoes.length; i++) {
      const index = filmeSessoes.findIndex(
        (filmeSessao) => filmeSessao.filme.id == sessoes[i].filme.id,
      );
      const sessao: SessaoType = {
        sessaoId: sessoes[i].id,
        salaId: sessoes[i].sala.id,
        inicio: sessoes[i].init,
        fim: sessoes[i].finish,
        status: sessoes[i].status,
      };
      console.table(sessao);
      console.table(sessoes[i]);
      if (index > 0) {
        console.log('entrei 1');
        filmeSessoes[index].sessoes.push(sessao);
      } else {
        console.log('entrei 2');
        const filmeSessao = new FilmeSessao();
        filmeSessao.filme = sessoes[i].filme;

        filmeSessao.sessoes = [];
        filmeSessao.sessoes.push(sessao);
        filmeSessoes.push(filmeSessao);
      }
    }
    console.table(filmeSessoes);
    return filmeSessoes;
  }
}

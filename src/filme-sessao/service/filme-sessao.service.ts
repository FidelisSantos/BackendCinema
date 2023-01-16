import { Injectable } from '@nestjs/common';
import { SessaoType } from 'src/sessao/types/SessaoType';
import { FilmeSessao } from 'src/sessao/types/filmeSessao';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';

@Injectable()
export class FilmeSessaoService {
  constructor(private sessaoRepository: SessaoRepositoryService) {}

  async findFilmeSessoes() {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date(Date.now());
    const sessoes = await this.sessaoRepository.findAll();
    const filmeSessoes: FilmeSessao[] = [];
    for (let i = 0; i < sessoes.length; i++) {
      const index = filmeSessoes.findIndex(
        (filmeSessao) => filmeSessao.filme.id == sessoes[i].filme.id,
      );
      const initSessao = new Date(sessoes[i].init);
      const diff = (today.getTime() - initSessao.getTime()) / oneDay;
      if (diff > -10 && diff < 5) {
        const sessao: SessaoType = {
          sessaoId: sessoes[i].id,
          salaId: sessoes[i].sala.id,
          inicio: sessoes[i].init,
          fim: sessoes[i].finish,
          status: sessoes[i].status,
        };
        if (index >= 0) {
          filmeSessoes[index].sessoes.push(sessao);
        } else {
          const filmeSessao = new FilmeSessao();
          filmeSessao.filme = sessoes[i].filme;
          filmeSessao.sessoes = [];
          filmeSessao.sessoes.push(sessao);
          filmeSessoes.push(filmeSessao);
        }
      }
    }
    return filmeSessoes;
  }
}

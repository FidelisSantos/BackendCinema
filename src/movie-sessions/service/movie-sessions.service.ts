import { Injectable } from '@nestjs/common';
import { SessionType } from '../types/sessionType';
import { SessionRepository } from '../../shared/repositorys/session-repository';
import { MovieSessions } from '../types/movieSessions';

@Injectable()
export class MovieSessionsService {
  constructor(private sessionRepository: SessionRepository) {}

  async findMovieSessions() {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date(Date.now());
    const sessoes = await this.sessionRepository.findAll();
    const filmeSessoes: MovieSessions[] = [];
    for (let i = 0; i < sessoes.length; i++) {
      const index = filmeSessoes.findIndex(
        (movieSession) => movieSession.filme.id == sessoes[i].filme.id,
      );
      const initsession = new Date(sessoes[i].init);
      const diff = (today.getTime() - initsession.getTime()) / oneDay;
      if (diff > -10 && diff < 5) {
        const session: SessionType = {
          sessaoId: sessoes[i].id,
          salaId: sessoes[i].sala.id,
          inicio: sessoes[i].init,
          fim: sessoes[i].finish,
          status: sessoes[i].status,
        };
        if (index >= 0) {
          filmeSessoes[index].sessoes.push(session);
        } else {
          const filmesession = new MovieSessions();
          filmesession.filme = sessoes[i].filme;
          filmesession.sessoes = [];
          filmesession.sessoes.push(session);
          filmeSessoes.push(filmesession);
        }
      }
    }
    return filmeSessoes;
  }
}

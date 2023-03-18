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
    const sessions = await this.sessionRepository.findAll();
    const movieSessions: MovieSessions[] = [];
    for (let i = 0; i < sessions.length; i++) {
      const index = movieSessions.findIndex(
        (movieSession) => movieSession.movie.id == sessions[i].movie.id,
      );
      const initsession = new Date(sessions[i].init);
      const diff = (today.getTime() - initsession.getTime()) / oneDay;
      if (diff > -10 && diff < 5) {
        const session: SessionType = {
          sessionId: sessions[i].id,
          roomId: sessions[i].room.id,
          roomName: sessions[i].room.name,
          init: sessions[i].init,
          finish: sessions[i].finish,
          status: sessions[i].status,
        };
        if (index >= 0) {
          movieSessions[index].sessions.push(session);
        } else {
          const movieSession = new MovieSessions();
          movieSession.movie = sessions[i].movie;
          movieSession.sessions = [];
          movieSession.sessions.push(session);
          movieSessions.push(movieSession);
        }
      }
    }
    return movieSessions;
  }
}

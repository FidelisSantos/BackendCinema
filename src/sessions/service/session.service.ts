import { Injectable, HttpException } from '@nestjs/common';
import { SessionDto } from '../dto/session.dto';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { SessionRepository } from '../../shared/repositorys/session-repository';
import { MappingService } from 'src/shared/mapping/mapping.service';
import { SessionInitFinish } from '../types/session-init-finish';

@Injectable()
export class SessionService {
  constructor(
    private roomRepository: RoomRepository,
    private movieRepository: MovieRepository,
    private sessionRepository: SessionRepository,
    private mapping: MappingService,
  ) {}

  async create(sessionDto: SessionDto) {
    const init = this.convertToDate(sessionDto.init);
    this.validateInit(init);
    const { room, movie } = await this.searchSalaAndFilme(
      sessionDto.roomId,
      sessionDto.movieId,
    );
    const finish = new Date(init.getTime() + movie.movieTime * 60000);
    const sessions = await this.searchRoomInSessions(room.id);
    if (sessions.length) {
      this.validateDateHourSession(sessions, init, movie.movieTime);
    }
    const session = this.mapping.SessionDtoToSession(room, movie, init, finish);

    return await this.sessionRepository.create(session);
  }

  async findAll() {
    return await this.sessionRepository.findAll();
  }

  async findOne(id: number) {
    const session = await this.sessionRepository.findOne(id);
    if (!session) throw new BadRequestError('Sessão não encontrada');
    return session;
  }

  async update(id: number, sessionDto: SessionDto) {
    const init = this.convertToDate(sessionDto.init);
    const session = await this.findOne(id);
    this.validateInit(init);
    this.validateUpdate(session.finish);
    const { room, movie } = await this.searchSalaAndFilme(
      sessionDto.roomId,
      sessionDto.movieId,
    );
    const sessions = await this.searchRoomInSessions(room.id, id);
    console.log(sessions);
    if (sessions.length) {
      const teste = this.validateDateHourSession(
        sessions,
        init,
        movie.movieTime,
      );
      console.log(teste);
    }
    const finish = new Date(init.getTime() + movie.movieTime * 60000);
    const editSession = this.mapping.SessionDtoToSession(
      room,
      movie,
      init,
      finish,
    );

    await this.sessionRepository.update(session, editSession);
  }

  async remove(id: number) {
    const session = await this.sessionRepository.findOne(id);
    const date = new Date(Date.now());
    if (session.init <= date && session.finish >= date)
      throw new BadRequestError('Sessão em andamento não pode ser deletada');
    else this.sessionRepository.remove(id);
  }

  private async searchSalaAndFilme(salaId: number, filmeId: number) {
    const room = await this.roomRepository.findOne(salaId);
    if (!room) throw new NotFoundError('Sala não encontrada');
    const movie = await this.movieRepository.findOne(filmeId);
    if (!movie) throw new NotFoundError('Filme não encontrado');

    return { room, movie };
  }

  private validateDateHourSession(
    sessions: SessionInitFinish[],
    init: Date,
    tempoFilme: number,
  ) {
    const finish = new Date(tempoFilme * 60000 + init.getTime());
    const maintenance = new Date(finish.getTime() + 1800 * 1000);
    for (let index = 0; index < sessions.length; index++) {
      const finishSessao = new Date(
        sessions[index].finish.getTime() + 1800 * 1000,
      );
      const initSessao = sessions[index].init;
      if (
        (init >= initSessao && init <= finishSessao) ||
        (maintenance >= initSessao && maintenance <= finishSessao)
      )
        throw new BadRequestError('Conflito com sessão já cadastrada');
    }
  }

  private validateInit(init: Date) {
    const timeNow = new Date(Date.now());
    let timeSession = init.getHours();
    if (timeSession === 0) {
      timeSession = 21;
    } else if (timeSession === 1) {
      timeSession = 22;
    } else {
      timeSession = timeSession - 3;
    }
    if (init < timeNow)
      throw new BadRequestError('Data/Hora de inicio inválida');

    if (init.getTime() - timeNow.getTime() < 86400000)
      throw new BadRequestError(
        'Sessão tem que ser cadastrada um dia antes no mínimo',
      );
    if (timeSession < 10 || timeSession >= 23)
      throw new BadRequestError(
        'O inicio da sessão tem que ser cadastrado entre as 10:00h e 22:59h',
      );
  }

  private async searchRoomInSessions(roomId: number, id?: number) {
    const sessions = await this.sessionRepository.findRoomInSessions(roomId);
    const sessionsEdit: SessionInitFinish[] = [];
    sessions.forEach((session) => {
      if (!id || session.id != id) {
        const sessionInitFinish =
          this.mapping.SessionToSessionInitFinish(session);
        sessionsEdit.push(sessionInitFinish);
      }
    });
    return sessionsEdit;
  }

  private validateUpdate(finish: Date) {
    const today = new Date();
    if (finish <= today)
      throw new BadRequestError('Sessão finzalida não pode ser editada');
  }

  private convertToDate(date: string) {
    try {
      return new Date(date);
    } catch {
      throw new BadRequestError('Data/horário inválida');
    }
  }
}

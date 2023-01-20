import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { Session } from '../entities/session.entity';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { SessionRepository } from '../../shared/repositorys/session-repository';
import { Room } from '../../rooms/entities/room.entity';

@Injectable()
export class SessionService {
  constructor(
    private roomRepository: RoomRepository,
    private movieRepository: MovieRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const init = this.convertToDate(createSessionDto.init);
    this.validateInit(init);
    const { sala, filme } = await this.searchSalaAndFilme(
      createSessionDto.salaId,
      createSessionDto.filmeId,
    );
    const sessions = await this.searchRoomInSessions(sala);
    if (sessions.length) {
      this.validateDateHourSession(sessions, init, filme.tempoDeFilme);
    }
    const session = new Session();
    session.sala = sala;
    session.filme = filme;
    session.init = init;
    session.finish = new Date(
      session.init.getTime() + filme.tempoDeFilme * 60000,
    );
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

  async findFilmeSession(filmeId: number) {
    return this.sessionRepository.findMovieSessions(filmeId);
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const init = this.convertToDate(updateSessionDto.init);
    const session = await this.findOne(id);
    this.validateInit(init);
    this.validateUpdate(session);
    const { sala, filme } = await this.searchSalaAndFilme(
      updateSessionDto.salaId,
      updateSessionDto.filmeId,
    );
    const sessions = await this.searchRoomInSessions(sala, id);
    if (sessions.length) {
      this.validateDateHourSession(sessions, init, filme.tempoDeFilme);
    }
    const editSession = new Session();
    editSession.filme = filme;
    editSession.sala = sala;
    editSession.init = init;
    editSession.finish = new Date(
      filme.tempoDeFilme * 60000 + editSession.init.getTime(),
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
    const sala = await this.roomRepository.findOne(salaId);
    if (!sala) throw new NotFoundError('Sala não encontrada');
    const filme = await this.movieRepository.findOne(filmeId);
    if (!filme) throw new NotFoundError('Filme não encontrado');

    return { sala, filme };
  }

  private validateDateHourSession(
    sessions: Session[],
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
      timeSession = 24;
    }
    if (init < timeNow)
      throw new BadRequestError('Data/Hora de inicio inválida');

    if (init.getTime() - timeNow.getTime() < 86400000)
      throw new BadRequestError(
        'Sessão tem que ser cadastrada um dia antes no mínimo',
      );
    if (timeSession - 3 < 10 || timeSession - 3 >= 23)
      throw new BadRequestError(
        'O inicio da sessão tem que ser cadastrado entre as 10:00h e 22:59h',
      );
  }

  private async searchRoomInSessions(room: Room, id?: number) {
    const sessions = await this.sessionRepository.findRoomInSessions(room);
    if (id) {
      const sessionsEdit: Session[] = [];
      sessions.forEach((session) => {
        if (session.id != id) sessionsEdit.push(session);
      });
      return sessionsEdit;
    } else return sessions;
  }

  private async validateUpdate(session: Session) {
    const maintenance = new Date(session.finish.getTime() + 1800 * 1000);
    if (session.finish <= session.init && maintenance >= session.init)
      throw new BadRequestError('Sala em manutenção não pode ser atualizada');
  }

  private convertToDate(date: string) {
    try {
      return new Date(date);
    } catch {
      throw new BadRequestError('Data/horário inválida');
    }
  }
}

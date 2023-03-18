import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusSessionEnum } from '../../sessions/enum/status-session.enum';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private sessaoRepository: Repository<Session>,
  ) {}

  async create(newSessao: Session) {
    return await this.sessaoRepository.save(newSessao);
  }

  async findAll() {
    return await this.sessaoRepository.find({
      relations: {
        movie: true,
        room: true,
      },
    });
  }

  async findMovieSessions(movieId: number) {
    return await this.sessaoRepository.findBy({ movie: { id: movieId } });
  }

  async findOne(id: number) {
    return await this.sessaoRepository.findOneBy({ id: id });
  }

  async useMovie(movieId: number) {
    return (await this.sessaoRepository.findBy({ movie: { id: movieId } }))
      .length
      ? true
      : false;
  }

  async useRoom(roomId: number) {
    return (await this.sessaoRepository.findBy({ room: { id: roomId } })).length
      ? true
      : false;
  }

  async findRoomInSessions(roomId: number) {
    const sessoes = await this.sessaoRepository.findBy({
      room: { id: roomId },
    });
    return sessoes;
  }

  async exists(id: number) {
    return (await this.sessaoRepository.findOneBy({ id })) ? true : false;
  }

  async update(session: Session, editSession: Session) {
    return await this.sessaoRepository.update(session, editSession);
  }

  async remove(id: number) {
    return await this.sessaoRepository.delete({ id });
  }

  async updateStatus(sessao: Session, status: StatusSessionEnum) {
    return await this.sessaoRepository.update(sessao, { status });
  }
}

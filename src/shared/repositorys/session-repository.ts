import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../session/entities/session.entity';
import { Repository } from 'typeorm';
import { StatusSessionEnum } from '../../session/enum/status-session.enum';
import { Room } from '../../rooms/entities/room.entity';
import { Movie } from '../../movies/entities/movie.entity';

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
        filme: true,
        sala: true,
      },
    });
  }

  async findMovieSessions(filmeId: number) {
    return await this.sessaoRepository
      .createQueryBuilder('sessao')
      .where('sessao.filmeId = :filmeId', { filmeId: filmeId })
      .getExists();
  }

  async findOne(id: number) {
    return await this.sessaoRepository.findOneBy({ id });
  }

  async useMovie(filme: Movie) {
    return (await this.sessaoRepository.findBy({ filme })).length
      ? true
      : false;
  }

  async useRoom(sala: Room) {
    return (await this.sessaoRepository.findBy({ sala })).length ? true : false;
  }

  async findRoomInSessions(sala: Room) {
    const sessoes = await this.sessaoRepository.findBy({ sala });
    return sessoes;
  }

  async exists(id: number) {
    return (await this.sessaoRepository.findOneBy({ id })) ? true : false;
  }

  async update(sessao: Session, editSessao: Session) {
    return await this.sessaoRepository.update(sessao, editSessao);
  }

  async remove(id: number) {
    return await this.sessaoRepository.delete({ id });
  }

  async updateStatus(sessao: Session, status: StatusSessionEnum) {
    return await this.sessaoRepository.update(sessao, { status });
  }
}

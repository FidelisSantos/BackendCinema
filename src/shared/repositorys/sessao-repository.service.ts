import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessao } from '../../sessao/entities/sessao.entity';
import { Repository } from 'typeorm';
import { StatusSessaoEnum } from '../../sessao/enum/status-sessao.enum';
import { Room } from '../../rooms/entities/room.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Injectable()
export class SessaoRepositoryService {
  constructor(
    @InjectRepository(Sessao)
    private sessaoRepository: Repository<Sessao>,
  ) {}

  async create(newSessao: Sessao) {
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

  async findFilmeSessao(filmeId: number) {
    return await this.sessaoRepository
      .createQueryBuilder('sessao')
      .where('sessao.filmeId = :filmeId', { filmeId: filmeId })
      .getExists();
  }

  async findOne(id: number) {
    return await this.sessaoRepository.findOneBy({ id });
  }

  async useFilme(filme: Movie) {
    return (await this.sessaoRepository.findBy({ filme })).length
      ? true
      : false;
  }

  async useSala(sala: Room) {
    return (await this.sessaoRepository.findBy({ sala })).length ? true : false;
  }

  async findSalasNasSessoes(sala: Room) {
    const sessoes = await this.sessaoRepository.findBy({ sala });
    return sessoes;
  }

  async exists(id: number) {
    return (await this.sessaoRepository.findOneBy({ id })) ? true : false;
  }

  async update(sessao: Sessao, editSessao: Sessao) {
    return await this.sessaoRepository.update(sessao, editSessao);
  }

  async remove(id: number) {
    return await this.sessaoRepository.delete({ id });
  }

  async updateStatus(sessao: Sessao, status: StatusSessaoEnum) {
    return await this.sessaoRepository.update(sessao, { status });
  }
}

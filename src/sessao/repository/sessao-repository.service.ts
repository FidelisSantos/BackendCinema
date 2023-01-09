import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessao } from '../entities/sessao.entity';
import { Repository } from 'typeorm';
import { StatusSessaoEnum } from '../enum/status-sessao.enum';

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
    return await this.sessaoRepository
      .createQueryBuilder('sessao')
      .innerJoinAndSelect('sessao.sala', 'sala')
      .innerJoinAndSelect('sessao.filme', 'filme')
      .getMany();
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

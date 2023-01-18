import { Injectable } from '@nestjs/common';
import { SalaRepositoryService } from '../../shared/repositorys/sala-repository.service';
import { Sala } from '../entities/sala.entity';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';

@Injectable()
export class SalaService {
  constructor(
    private salaRepository: SalaRepositoryService,
    private sessaoRepository: SessaoRepositoryService,
  ) {}

  async create() {
    const newSala = new Sala();
    return await this.salaRepository.create(newSala);
  }

  async findAll() {
    return await this.salaRepository.findAll();
  }

  async remove(id: number) {
    const sala = await this.findOne(id);
    if (await this.sessaoRepository.useSala(sala))
      throw new BadRequestError('Sala cadastrada em uma sessão');
    const response = await this.salaRepository.remove(sala);
    return response;
  }

  async findOne(id: number) {
    const sala = await this.salaRepository.findOne(id);
    if (!sala) throw new NotFoundError('Sala não encontrada');
    return sala;
  }
}

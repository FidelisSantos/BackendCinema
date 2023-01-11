import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SalaRepositoryService } from '../../shared/repositorys/sala-repository.service';
import { Sala } from '../entities/sala.entity';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';

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
      throw new HttpException(
        'Sala cadastrada em uma sessão',
        HttpStatus.BAD_REQUEST,
      );
    const response = await this.salaRepository.remove(sala);
    return response;
  }

  async findOne(id: number) {
    const sala = await this.salaRepository.findOne(id);
    if (!sala) throw new HttpException('Sala not found', HttpStatus.NOT_FOUND);
    return sala;
  }
}

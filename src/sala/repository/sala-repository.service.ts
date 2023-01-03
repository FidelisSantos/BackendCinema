import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sala } from '../entities/sala.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalaRepositoryService {
  constructor(
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
  ) {}

  async create(newSala: Sala) {
    return await this.salaRepository.save(newSala);
  }

  async remove(sala: Sala) {
    await this.salaRepository.delete(sala);
  }

  async findOne(id: number) {
    return await this.salaRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.salaRepository.find();
  }

  async update(sala: Sala, updateSala: Sala) {
    return await this.salaRepository.update(sala, updateSala);
  }
}

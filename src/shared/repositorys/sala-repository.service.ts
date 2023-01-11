import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sala } from '../../sala/entities/sala.entity';
import { Repository } from 'typeorm';
import { StatusSalaEnum } from 'src/sala/enum/status-sala.enum';

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
    return await this.salaRepository.delete(sala);
  }

  async findOne(id: number) {
    return await this.salaRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.salaRepository.find();
  }

  async update(sala: Sala, status: StatusSalaEnum) {
    return await this.salaRepository.update(sala, { status });
  }
}

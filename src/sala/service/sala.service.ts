import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StatusSalaEnum } from '../enum/status-sala.enum';
import { SalaRepositoryService } from '../repository/sala-repository.service';
import { Sala } from '../entities/sala.entity';

@Injectable()
export class SalaService {
  constructor(private repository: SalaRepositoryService) {}

  async create() {
    const newSala = new Sala();
    return await this.repository.create(newSala);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async remove(id: number) {
    const sala = await this.findOne(id);
    if (!sala) throw new HttpException('Sala not found', HttpStatus.NOT_FOUND);
    return this.repository.remove(sala);
  }

  async findOne(id: number) {
    const sala = await this.repository.findOne(id);
    if (!sala) throw new HttpException('Sala not found', HttpStatus.NOT_FOUND);
    return sala;
  }

  async update(sala: Sala, status: StatusSalaEnum) {
    const updateSala = new Sala();
    updateSala.status = status;
    await this.repository.update(sala, updateSala);
  }
}

import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { Room } from '../entities/room.entity';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private sessaoRepository: SessaoRepositoryService,
  ) {}

  async create() {
    const newRoom = new Room();
    return await this.roomRepository.create(newRoom);
  }

  async findAll() {
    return await this.roomRepository.findAll();
  }

  async remove(id: number) {
    const sala = await this.findOne(id);
    if (await this.sessaoRepository.useSala(sala))
      throw new BadRequestError('Sala cadastrada em uma sessão');
    const response = await this.roomRepository.remove(sala);
    return response;
  }

  async findOne(id: number) {
    const sala = await this.roomRepository.findOne(id);
    if (!sala) throw new NotFoundError('Sala não encontrada');
    return sala;
  }
}

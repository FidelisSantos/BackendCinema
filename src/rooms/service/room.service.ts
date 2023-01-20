import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { Room } from '../entities/room.entity';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { SessionRepository } from '../../shared/repositorys/session-repository';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private sessionRepository: SessionRepository,
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
    if (await this.sessionRepository.useRoom(sala))
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

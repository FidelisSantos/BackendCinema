import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { SessionRepository } from '../../shared/repositorys/session-repository';
import { MappingService } from 'src/shared/mapping/mapping.service';
import { RoomDto } from '../dto/room.dto';
import { ConflictError } from '../../errors/conflict.error';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private sessionRepository: SessionRepository,
    private mapping: MappingService,
  ) {}

  async create(roomDto: RoomDto) {
    if (await this.roomRepository.exists(roomDto.name))
      throw new ConflictError('Já existe sala com esse nome');
    const room = this.mapping.RoomDtoToRoom(roomDto);
    return await this.roomRepository.create(room);
  }

  async findAll() {
    return await this.roomRepository.findAll();
  }

  async update(roomDto: RoomDto, id: number) {
    const room = await this.findOne(id);
    if (room.name === roomDto.name)
      throw new ConflictError('Sala já está com esse nome ');
    if (await this.roomRepository.exists(roomDto.name))
      throw new ConflictError('Já existe sala com esse nome');
    return await this.roomRepository.update(id, roomDto.name);
  }

  async remove(id: number) {
    await this.findOne(id);
    if (await this.sessionRepository.useRoom(id))
      throw new BadRequestError('Sala cadastrada em uma sessão');
    const response = await this.roomRepository.remove(id);
    return response;
  }

  async findOne(id: number) {
    const room = await this.roomRepository.findOne(id);
    if (!room) throw new NotFoundError('Sala não encontrada');
    return room;
  }
}

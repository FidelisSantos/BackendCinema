import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { StatusRoomEnum } from '../../rooms/enum/status-room.enum';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private salaRepository: Repository<Room>,
  ) {}

  async create(newSala: Room) {
    return await this.salaRepository.save(newSala);
  }

  async remove(sala: Room) {
    return await this.salaRepository.delete(sala);
  }

  async findOne(id: number) {
    return await this.salaRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.salaRepository.find();
  }

  async update(sala: Room, status: StatusRoomEnum) {
    return await this.salaRepository.update(sala, { status });
  }
}

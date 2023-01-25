import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { StatusRoomEnum } from '../../rooms/enum/status-room.enum';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(newSala: Room) {
    return await this.roomRepository.save(newSala);
  }

  async remove(id: number) {
    return await this.roomRepository.delete({ id });
  }

  async findOne(id: number) {
    return await this.roomRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.roomRepository.find();
  }

  async updateStatus(id: number, status: StatusRoomEnum) {
    return await this.roomRepository.update({ id }, { status });
  }

  async update(id: number, name: string) {
    return await this.roomRepository.update({ id }, { name });
  }

  async exists(name: string) {
    return (await this.roomRepository.countBy({ name })) > 0;
  }
}

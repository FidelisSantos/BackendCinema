import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseFilters,
  Body,
  Patch,
} from '@nestjs/common';
import { RoomService } from '../service/room.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from '../../http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';
import { RoomDto } from '../dto/room.dto';
import { ConflictFilter } from 'src/http-excepitions/conflict.filter';
@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter, ConflictFilter)
@Controller('sala')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() roomDto: RoomDto) {
    return await this.roomService.create(roomDto);
  }

  @Get()
  async findAll() {
    return await this.roomService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() roomDto: RoomDto) {
    return await this.roomService.update(roomDto, id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.roomService.remove(id);
  }
}

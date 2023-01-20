import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { RoomService } from '../service/room.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from '../../http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';
//@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('sala')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create() {
    return await this.roomService.create();
  }

  @Get()
  async findAll() {
    return await this.roomService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}

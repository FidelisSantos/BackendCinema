import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { SalaService } from '../service/sala.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from '../../http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';
@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('sala')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  async create() {
    return await this.salaService.create();
  }

  @Get()
  async findAll() {
    return await this.salaService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salaService.remove(+id);
  }
}

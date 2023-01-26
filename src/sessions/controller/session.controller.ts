import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { SessionService } from '../service/session.service';
import { SessionDto } from '../dto/session.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from 'src/http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';
import { ConflictFilter } from '../../http-excepitions/conflict.filter';

@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter, ConflictFilter)
@Controller('sessao')
export class SessaoController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() sessionDto: SessionDto) {
    return this.sessionService.create(sessionDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() sessionDto: SessionDto) {
    return this.sessionService.update(id, sessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sessionService.remove(id);
  }
}

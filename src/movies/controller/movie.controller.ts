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
import { MovieService } from '../service/movie.service';
import { MovieDto } from '../dto/movie.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from 'src/http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';
import { ConflictFilter } from '../../http-excepitions/conflict.filter';

@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter, ConflictFilter)
@Controller('filme')
export class FilmeController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() movieDto: MovieDto) {
    return this.movieService.create(movieDto);
  }

  @Get()
  async findAll() {
    return await this.movieService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() movieDto: MovieDto) {
    return this.movieService.update(id, movieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}

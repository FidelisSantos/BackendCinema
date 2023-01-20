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
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from 'src/http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';

//@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('filme')
export class FilmeController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  async findAll() {
    return await this.movieService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}

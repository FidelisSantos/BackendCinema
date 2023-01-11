import { Controller, Get } from '@nestjs/common';
import { FilmeSessaoService } from '../service/filme-sessao.service';

@Controller('filmesessao')
export class FilmeSessaoController {
  constructor(private readonly filmeSessaoService: FilmeSessaoService) {}

  @Get()
  async findFilmeSessao() {
    return await this.filmeSessaoService.findFilmeSessoes();
  }
}

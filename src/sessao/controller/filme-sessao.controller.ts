import { Controller, Get } from '@nestjs/common';
import { SessaoService } from '../service/sessao.service';

@Controller('filmesessao')
export class FilmeSessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Get()
  async findFilmeSessao() {
    return await this.sessaoService.findFilmeSessoes();
  }
}

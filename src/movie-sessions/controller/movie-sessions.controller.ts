import { Controller, Get } from '@nestjs/common';
import { MovieSessionsService } from '../service/movie-sessions.service';

@Controller('filmesessao')
export class FilmeSessaoController {
  constructor(private readonly movieSessionsService: MovieSessionsService) {}

  @Get()
  async findMovieSessions() {
    return await this.movieSessionsService.findMovieSessions();
  }
}

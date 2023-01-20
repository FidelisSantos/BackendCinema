import { Module } from '@nestjs/common';
import { MovieSessionsService } from './service/movie-sessions.service';
import { SharedModule } from 'src/shared/shared.module';
import { FilmeSessaoController } from './controller/movie-sessions.controller';

@Module({
  controllers: [FilmeSessaoController],
  imports: [SharedModule],
  providers: [MovieSessionsService],
})
export class MovieSessionsModule {}

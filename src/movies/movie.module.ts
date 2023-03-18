import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { MovieService } from './service/movie.service';
import { FilmeController } from './controller/movie.controller';

@Module({
  imports: [SharedModule],
  controllers: [FilmeController],
  providers: [MovieService],
})
export class MoviesModule {}

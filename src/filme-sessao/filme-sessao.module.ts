import { Module } from '@nestjs/common';
import { FilmeSessaoService } from './service/filme-sessao.service';
import { SharedModule } from 'src/shared/shared.module';
import { FilmeSessaoController } from './controller/filme-sessao.controller';

@Module({
  controllers: [FilmeSessaoController],
  imports: [SharedModule],
  providers: [FilmeSessaoService],
})
export class FilmeSessaoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaModule } from '../sala/sala.module';
import { FilmeModule } from '../filme/filme.module';

import { Sessao } from './entities/sessao.entity';
import { SessaoService } from './service/sessao.service';
import { SessaoController } from './controller/sessao.controller';
import { SessaoRepositoryService } from './repository/sessao-repository.service';
import { SessaoCronService } from './cron/sessao-cron.service';
import { FilmeSessaoController } from './controller/filme-sessao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sessao]), SalaModule, FilmeModule],
  controllers: [SessaoController, FilmeSessaoController],
  providers: [SessaoService, SessaoRepositoryService, SessaoCronService],
  exports: [SessaoRepositoryService],
})
export class SessaoModule {}

import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { SessaoService } from './service/sessao.service';
import { SessaoController } from './controller/sessao.controller';
import { SessaoCronService } from './cron/sessao-cron.service';
import { FilmeSessaoController } from './controller/filme-sessao.controller';

@Module({
  imports: [SharedModule],
  controllers: [SessaoController, FilmeSessaoController],
  providers: [SessaoService, SessaoCronService],
})
export class SessaoModule {}

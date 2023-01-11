import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { SessaoService } from './service/sessao.service';
import { SessaoController } from './controller/sessao.controller';
import { SessaoValidationService } from './validation/sessao-validation.service';

@Module({
  imports: [SharedModule],
  controllers: [SessaoController],
  providers: [SessaoService, SessaoValidationService],
})
export class SessaoModule {}

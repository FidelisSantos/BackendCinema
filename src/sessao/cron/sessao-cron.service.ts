import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessaoService } from '../service/sessao.service';

@Injectable()
export class SessaoCronService {
  constructor(private sessaoService: SessaoService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    await this.sessaoService.updateStatusSalaSessao();
  }
}

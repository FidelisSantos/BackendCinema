import { Injectable } from '@nestjs/common';
import { SessaoRepositoryService } from '../../shared/repositorys/sessao-repository.service';
import { SalaRepositoryService } from '../../shared/repositorys/sala-repository.service';
import { StatusSalaEnum } from 'src/sala/enum/status-sala.enum';
import { StatusSessaoEnum } from 'src/sessao/enum/status-sessao.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StatusService {
  constructor(
    private sessaoRepository: SessaoRepositoryService,
    private salaRepository: SalaRepositoryService,
  ) {
    this.updateStatusSalaSessao();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateStatusSalaSessao() {
    const sessoes = await this.sessaoRepository.findAll();
    console.log('rodei');
    sessoes.forEach(async (sessao) => {
      const today = new Date(Date.now());
      const maintenance = new Date(sessao.finish.getTime() + 1800 * 1000);
      if (sessao.init <= today && sessao.finish >= today) {
        if (sessao.sala.status != StatusSalaEnum.RUN)
          await this.salaRepository.update(sessao.sala, StatusSalaEnum.RUN);
        if (sessao.status != StatusSessaoEnum.RUN)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.RUN,
          );
      } else if (sessao.finish <= today && maintenance >= today) {
        if (sessao.sala.status != StatusSalaEnum.MAINTENANCE)
          await this.salaRepository.update(
            sessao.sala,
            StatusSalaEnum.MAINTENANCE,
          );
        if (sessao.status != StatusSessaoEnum.FINISH)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.FINISH,
          );
      } else {
        if (sessao.sala.status != StatusSalaEnum.FREE)
          await this.salaRepository.update(sessao.sala, StatusSalaEnum.FREE);
        if (sessao.init > today && sessao.status != StatusSessaoEnum.WAITING)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.WAITING,
          );
        if (sessao.finish < today && sessao.status != StatusSessaoEnum.FINISH)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.FINISH,
          );
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { SessaoRepositoryService } from '../../shared/repositorys/sessao-repository.service';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { StatusSessaoEnum } from 'src/sessao/enum/status-sessao.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatusRoomEnum } from '../../rooms/enum/status-room.enum';

@Injectable()
export class StatusService {
  constructor(
    private sessaoRepository: SessaoRepositoryService,
    private roomRepository: RoomRepository,
  ) {
    this.updateStatusSalaSessao();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateStatusSalaSessao() {
    const sessoes = await this.sessaoRepository.findAll();
    sessoes.forEach(async (sessao) => {
      const today = new Date(Date.now());
      const maintenance = new Date(sessao.finish.getTime() + 1800 * 1000);
      if (sessao.init <= today && sessao.finish >= today) {
        if (sessao.sala.status != StatusRoomEnum.RUN)
          await this.roomRepository.update(sessao.sala, StatusRoomEnum.RUN);
        if (sessao.status != StatusSessaoEnum.RUN)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.RUN,
          );
      } else if (sessao.finish <= today && maintenance >= today) {
        if (sessao.sala.status != StatusRoomEnum.MAINTENANCE)
          await this.roomRepository.update(
            sessao.sala,
            StatusRoomEnum.MAINTENANCE,
          );
        if (sessao.status != StatusSessaoEnum.FINISH)
          await this.sessaoRepository.updateStatus(
            sessao,
            StatusSessaoEnum.FINISH,
          );
      } else {
        if (sessao.sala.status != StatusRoomEnum.FREE)
          await this.roomRepository.update(sessao.sala, StatusRoomEnum.FREE);
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

  @Cron(CronExpression.EVERY_30_SECONDS)
  async autoExcludeSession() {
    const oneDay = 24 * 60 * 60 * 1000;
    const sessoes = await this.sessaoRepository.findAll();
    const today = new Date(Date.now());
    sessoes.forEach(async (sessao) => {
      const diff = (today.getTime() - sessao.finish.getTime()) / oneDay;
      if (diff >= 6) {
        await this.sessaoRepository.remove(sessao.id);
      }
    });
  }
}

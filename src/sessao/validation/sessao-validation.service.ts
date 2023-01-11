import { Injectable } from '@nestjs/common';
import { Sessao } from '../entities/sessao.entity';
import { CreateSessaoDto } from '../dto/create-sessao.dto';

@Injectable()
export class SessaoValidationService {
  validateDateHourSessao(
    sessoes: Sessao[],
    newSessao: Partial<CreateSessaoDto>,
    tempoFilme: number,
  ) {
    console.log('entrei');
    if (!newSessao.init) newSessao.init = Date.now().toString();
    const init = new Date(newSessao.init);
    const finish = new Date(tempoFilme * 60000 + init.getTime());
    const finishMaintenance = new Date(finish.getTime() + 1800 * 1000);
    console.log('finish', finishMaintenance);
    for (let index = 0; index < sessoes.length; index++) {
      const finishSessao = new Date(
        sessoes[index].finish.getTime() + 1800 * 1000,
      );
      const initSessao = sessoes[index].init;
      if (
        (init >= initSessao && init <= finishSessao) ||
        (finishMaintenance >= initSessao && finishMaintenance <= finishSessao)
      )
        return false;
    }
    return true;
  }
}

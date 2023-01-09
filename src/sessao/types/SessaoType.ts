import { StatusSessaoEnum } from '../enum/status-sessao.enum';

export type SessaoType = {
  sessaoId: number;
  salaId: number;
  inicio: Date;
  fim: Date;
  status: StatusSessaoEnum;
};

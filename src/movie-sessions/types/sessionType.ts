import { StatusSessionEnum } from '../../session/enum/status-session.enum';

export type SessionType = {
  sessaoId: number;
  salaId: number;
  inicio: Date;
  fim: Date;
  status: StatusSessionEnum;
};

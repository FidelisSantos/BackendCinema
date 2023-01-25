import { StatusSessionEnum } from '../../sessions/enum/status-session.enum';

export type SessionType = {
  sessionId: number;
  roomId: number;
  init: Date;
  finish: Date;
  status: StatusSessionEnum;
};

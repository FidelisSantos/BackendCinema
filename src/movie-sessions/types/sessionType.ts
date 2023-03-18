import { StatusSessionEnum } from '../../sessions/enum/status-session.enum';

export type SessionType = {
  sessionId: number;
  roomId: number;
  roomName: string;
  init: Date;
  finish: Date;
  status: StatusSessionEnum;
};

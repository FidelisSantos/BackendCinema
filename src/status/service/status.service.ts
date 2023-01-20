import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../../shared/repositorys/session-repository';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatusRoomEnum } from '../../rooms/enum/status-room.enum';
import { StatusSessionEnum } from '../../session/enum/status-session.enum';
import { Session } from '../../session/entities/session.entity';

@Injectable()
export class StatusService {
  constructor(
    private sessionRepository: SessionRepository,
    private roomRepository: RoomRepository,
  ) {
    this.updateStatus();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateStatus() {
    const sessions = await this.sessionRepository.findAll();
    sessions.forEach(async (session) => {
      await this.updateRoom(session);
      await this.updateSession(session);
    });
  }

  async updateRoom(session: Session) {
    const today = new Date(Date.now());
    const maintenance = new Date(session.finish.getTime() + 1800 * 1000);
    if (
      session.init <= today &&
      session.finish >= today &&
      session.sala.status != StatusRoomEnum.RUN
    )
      await this.roomRepository.update(session.sala, StatusRoomEnum.RUN);
    else if (
      session.finish <= today &&
      maintenance >= today &&
      session.sala.status != StatusRoomEnum.MAINTENANCE
    )
      await this.roomRepository.update(
        session.sala,
        StatusRoomEnum.MAINTENANCE,
      );
    else if (session.sala.status != StatusRoomEnum.FREE)
      await this.roomRepository.update(session.sala, StatusRoomEnum.FREE);
  }

  async updateSession(session: Session) {
    const today = new Date(Date.now());
    if (session.init <= today && session.status != StatusSessionEnum.WAITING)
      await this.sessionRepository.updateStatus(
        session,
        StatusSessionEnum.WAITING,
      );
    else if (
      session.init <= today &&
      session.finish >= today &&
      session.status != StatusSessionEnum.RUN
    )
      await this.sessionRepository.updateStatus(
        session,
        StatusSessionEnum.WAITING,
      );
    else if (session.finish >= today)
      await this.sessionRepository.updateStatus(
        session,
        StatusSessionEnum.FINISH,
      );
  }
}

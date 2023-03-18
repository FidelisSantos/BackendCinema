import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { RoomService } from './service/room.service';
import { RoomController } from './controller/room.controller';

@Module({
  imports: [SharedModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class SalaModule {}

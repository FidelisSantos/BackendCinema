import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { SessionService } from './service/session.service';
import { SessaoController } from './controller/session.controller';

@Module({
  imports: [SharedModule],
  controllers: [SessaoController],
  providers: [SessionService],
})
export class SessionModule {}

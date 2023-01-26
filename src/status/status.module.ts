import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { StatusService } from './service/status.service';

@Module({
  imports: [SharedModule],
  providers: [StatusService],
})
export class StatusModule {}

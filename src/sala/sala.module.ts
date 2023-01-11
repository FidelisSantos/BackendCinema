import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { SalaService } from './service/sala.service';
import { SalaController } from './controller/sala.controller';

@Module({
  imports: [SharedModule],
  controllers: [SalaController],
  providers: [SalaService],
  exports: [SalaService],
})
export class SalaModule {}

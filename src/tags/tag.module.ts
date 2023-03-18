import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { TagService } from './service/tag.service';
import { TagController } from './controller/tag.controller';

@Module({
  imports: [SharedModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}

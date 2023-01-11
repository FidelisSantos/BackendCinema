import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';

import { TagsService } from './service/tags.service';
import { TagsController } from './controller/tags.controller';

@Module({
  imports: [SharedModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

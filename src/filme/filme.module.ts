import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { FilmeValidationService } from './validation/filme-validation.service';
import { FilmeService } from './service/filme.service';
import { FilmeController } from './controller/filme.controller';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [SharedModule, TagsModule],
  controllers: [FilmeController],
  providers: [FilmeService, FilmeValidationService],
  exports: [FilmeService],
})
export class FilmeModule {}

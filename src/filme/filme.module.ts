import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmeRepositoryService } from './repository/filme-repository.service';
import { FilmeValidationService } from './validation/filme-validation.service';
import { FilmeService } from './service/filme.service';
import { FilmeController } from './controller/filme.controller';
import { Filme } from './entities/filme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filme])],
  controllers: [FilmeController],
  providers: [FilmeService, FilmeRepositoryService, FilmeValidationService],
  exports: [FilmeService],
})
export class FilmeModule {}

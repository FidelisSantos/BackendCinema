import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sala } from './entities/sala.entity';
import { SalaService } from './service/sala.service';
import { SalaController } from './controller/sala.controller';
import { SalaRepositoryService } from './repository/sala-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])],
  controllers: [SalaController],
  providers: [SalaService, SalaRepositoryService],
  exports: [SalaService],
})
export class SalaModule {}

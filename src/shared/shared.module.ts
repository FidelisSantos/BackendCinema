import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sessao } from 'src/sessao/entities/sessao.entity';
import { Sala } from '../sala/entities/sala.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Filme } from 'src/filme/entities/filme.entity';
import { SessaoRepositoryService } from './repositorys/sessao-repository.service';
import { SalaRepositoryService } from './repositorys/sala-repository.service';
import { FilmeRepositoryService } from './repositorys/filme-repository.service';
import { TagsRepositoryService } from './repositorys/tags-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sessao, Sala, Tag, Filme])],
  providers: [
    SessaoRepositoryService,
    SalaRepositoryService,
    FilmeRepositoryService,
    TagsRepositoryService,
  ],
  exports: [
    SessaoRepositoryService,
    SalaRepositoryService,
    FilmeRepositoryService,
    TagsRepositoryService,
  ],
})
export class SharedModule {}

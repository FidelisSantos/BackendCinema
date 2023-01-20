import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sessao } from 'src/sessao/entities/sessao.entity';
import { Room } from '../rooms/entities/room.entity';
import { Tag } from '../tags/entities/tag.entity';
import { SessaoRepositoryService } from './repositorys/sessao-repository.service';
import { RoomRepository } from './repositorys/room-repository';
import { MovieRepository } from './repositorys/movie-repository';
import { TagsRepositoryService } from './repositorys/tags-repository.service';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sessao, Room, Tag, Movie])],
  providers: [
    SessaoRepositoryService,
    RoomRepository,
    MovieRepository,
    TagsRepositoryService,
  ],
  exports: [
    SessaoRepositoryService,
    RoomRepository,
    MovieRepository,
    TagsRepositoryService,
  ],
})
export class SharedModule {}

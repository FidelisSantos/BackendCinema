import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionRepository } from './repositorys/session-repository';
import { RoomRepository } from './repositorys/room-repository';
import { MovieRepository } from './repositorys/movie-repository';
import { TagRepository } from './repositorys/tag-repository';
import { Session } from './entities/session.entity';
import { Room } from './entities/room.entity';
import { Tag } from './entities/tag.entity';
import { Movie } from './entities/movie.entity';
import { MappingService } from 'src/shared/mapping/mapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Room, Tag, Movie])],
  providers: [
    SessionRepository,
    RoomRepository,
    MovieRepository,
    TagRepository,
    MappingService,
  ],
  exports: [
    SessionRepository,
    RoomRepository,
    MovieRepository,
    TagRepository,
    MappingService,
  ],
})
export class SharedModule {}

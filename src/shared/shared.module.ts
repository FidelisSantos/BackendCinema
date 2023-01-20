import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from '../session/entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { Tag } from '../tags/entities/tag.entity';
import { SessionRepository } from './repositorys/session-repository';
import { RoomRepository } from './repositorys/room-repository';
import { MovieRepository } from './repositorys/movie-repository';
import { TagRepository } from './repositorys/tag-repository';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Room, Tag, Movie])],
  providers: [
    SessionRepository,
    RoomRepository,
    MovieRepository,
    TagRepository,
  ],
  exports: [SessionRepository, RoomRepository, MovieRepository, TagRepository],
})
export class SharedModule {}

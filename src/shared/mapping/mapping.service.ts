import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomDto } from '../../rooms/dto/room.dto';
import { MovieDto } from 'src/movies/dto/movie.dto';
import { Tag } from '../entities/tag.entity';
import { Movie } from '../entities/movie.entity';
import { Session } from '../entities/session.entity';
import { SessionInitFinish } from 'src/sessions/types/session-init-finish';
import { TagDto } from 'src/tags/dto/tag.dto';

@Injectable()
export class MappingService {
  RoomDtoToRoom(roomDto: RoomDto) {
    const room = new Room();
    room.name = roomDto.name;

    return room;
  }

  MovieDtoToMovie(movieDto: MovieDto, tags: Tag[]) {
    const movie = new Movie();
    movie.title = movieDto.title;
    movie.description = movieDto.description;
    movie.imageLink = movieDto.imageLink;
    movie.movieTime = movieDto.movieTime;
    movie.classification = movieDto.classification;
    movie.tags = tags;

    return movie;
  }

  SessionDtoToSession(room: Room, movie: Movie, init: Date, finish: Date) {
    const session = new Session();
    session.init = init;
    session.finish = finish;
    session.room = room;
    session.movie = movie;

    return session;
  }

  SessionToSessionInitFinish(session: Session) {
    const sessionInitFinish: SessionInitFinish = {
      init: session.init,
      finish: session.finish,
    };

    return sessionInitFinish;
  }

  TagDtoToTag(tagDto: TagDto) {
    const tag = new Tag();
    tag.tag = tagDto.tag;

    return tag;
  }
}

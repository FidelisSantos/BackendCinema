import { Module } from '@nestjs/common';
import { SalaModule } from './rooms/room.module';
import { SessionModule } from './sessions/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movie.module';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './controller/app.controller';
import { typeOrmConfig } from './typeorm.config';
import { TagModule } from './tags/tag.module';
import { SharedModule } from './shared/shared.module';
import { StatusModule } from './status/status.module';
import { MovieSessionsModule } from './movie-sessions/movie-sessions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    SharedModule,
    StatusModule,
    SalaModule,
    UserModule,
    AuthModule,
    MoviesModule,
    SessionModule,
    TagModule,
    MovieSessionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilmeModule } from './filme/filme.module';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './controller/app.controller';
import { typeOrmConfig } from './typeorm.config';
import { TagsModule } from './tags/tags.module';
import { SharedModule } from './shared/shared.module';
import { StatusModule } from './status/status.module';
import { FilmeSessaoModule } from './filme-sessao/filme-sessao.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    SharedModule,
    StatusModule,
    SalaModule,
    UserModule,
    AuthModule,
    FilmeModule,
    SessaoModule,
    TagsModule,
    FilmeSessaoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

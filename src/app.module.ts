import { Module } from '@nestjs/common';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilmeModule } from './filme/filme.module';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './controller/app.controller';
import { typeOrmConfig } from '../config/typeorm.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    SalaModule,
    UserModule,
    AuthModule,
    FilmeModule,
    SessaoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

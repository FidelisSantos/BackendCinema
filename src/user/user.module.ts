import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserService } from './service/user.service';
import { RepositoryService } from './repository/repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, RepositoryService],
  exports: [UserService],
})
export class UserModule {}

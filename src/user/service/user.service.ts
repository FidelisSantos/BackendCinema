import { Injectable } from '@nestjs/common';

import { RepositoryService } from '../repository/repository.service';
import { LoginType } from 'src/auth/types/login.type';

@Injectable()
export class UserService {
  constructor(private readonly repository: RepositoryService) {}

  async validateLogin(login: LoginType) {
    return await this.repository.findUser(login.email, login.password);
  }
}

import { Injectable } from '@nestjs/common';
import { LoginType } from '../types/login.type';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UserService,
    private jwtService: JwtService,
  ) {}

  async login(login: LoginType) {
    const user = await this.validateCredentials(login);

    const payload = {
      email: user.email,
    };
    return await this.jwtService.signAsync(payload);
  }

  async validateCredentials(credentials: LoginType) {
    return this.userServices.validateLogin(credentials);
  }
}

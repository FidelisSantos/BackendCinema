import { Injectable } from '@nestjs/common';

@Injectable()
export class FilmeValidationService {
  async validateLink(link: string) {
    const http = 'http://';
    const https = 'https://';
    if (link.includes(http) || link.includes(https)) return true;
    return false;
  }

  async validateTime(time: number) {
    if (time < 0) return false;
    return true;
  }
}

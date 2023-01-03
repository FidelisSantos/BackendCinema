import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalaService } from '../service/sala.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('sala')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  async create() {
    return await this.salaService.create();
  }

  @Get()
  async findAll() {
    return await this.salaService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.salaService.remove(+id);
  }
}

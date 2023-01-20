import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { SessionService } from '../service/session.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { BadRequestFilter } from 'src/http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';

//@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('sessao')
export class SessaoController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessaoDto: CreateSessionDto) {
    return this.sessionService.create(createSessaoDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessaoDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FilmeService } from '../service/filme.service';
import { CreateFilmeDto } from '../dto/create-filme.dto';
import { UpdateFilmeDto } from '../dto/update-filme.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('filme')
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Post()
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmeService.create(createFilmeDto);
  }

  @Get()
  async findAll() {
    return await this.filmeService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFilmeDto: UpdateFilmeDto) {
    return this.filmeService.update(+id, updateFilmeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmeService.remove(+id);
  }
}

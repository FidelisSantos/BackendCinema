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
import { TagService } from '../service/tag.service';
import { TagDto } from '../dto/tag.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { BadRequestFilter } from 'src/http-excepitions/bad-request.filter';
import { NotFoundFilter } from 'src/http-excepitions/not-found.filter';

//@UseGuards(JwtGuard)
@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() tagDto: TagDto) {
    return this.tagService.create(tagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() tagDto: TagDto) {
    return this.tagService.update(id, tagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tagService.remove(id);
  }
}

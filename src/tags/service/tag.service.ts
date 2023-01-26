import { Injectable } from '@nestjs/common';
import { TagDto } from '../dto/tag.dto';
import { TagRepository } from '../../shared/repositorys/tag-repository';

import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { NotFoundError } from '../../errors/not-found.error';
import { BadRequestError } from 'src/errors/bad-request.error';
import { MappingService } from 'src/shared/mapping/mapping.service';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private movieRepository: MovieRepository,
    private mapping: MappingService,
  ) {}

  async create(tagDto: TagDto) {
    if (await this.tagRepository.tagExists(tagDto.tag))
      throw new BadRequestError('Tag já existe');
    const tag = this.mapping.TagDtoToTag(tagDto);
    return await this.tagRepository.create(tag);
  }

  async findAll() {
    return await this.tagRepository.findAll();
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne(id);
    if (!tag) throw new NotFoundError('Tag não encontrada');
    return tag;
  }

  async update(id: number, tagDto: TagDto) {
    const tag = await this.searchTag(id);
    if (await this.tagRepository.tagExists(tagDto.tag))
      throw new BadRequestError('Tag já existe');
    return await this.tagRepository.update(tag, tagDto.tag);
  }

  async remove(id: number) {
    const tag = await this.searchTag(id);
    if (await this.movieRepository.useTag(tag))
      throw new BadRequestError('Tag em uso');
    if (!tag) throw new BadRequestError('Tag não existe');
    return this.tagRepository.remove(id);
  }

  private async searchTag(id: number) {
    const tag = await this.tagRepository.findOne(id);
    if (!tag) throw new BadRequestError('Tag não existe');
    return tag;
  }
}

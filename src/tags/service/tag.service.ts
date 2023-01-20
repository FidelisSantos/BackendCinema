import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagRepository } from '../../shared/repositorys/tag-repository';
import { Tag } from '../entities/tag.entity';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { NotFoundError } from '../../errors/not-found.error';
import { BadRequestError } from 'src/errors/bad-request.error';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private movieRepository: MovieRepository,
  ) {}

  async create(createTagDto: CreateTagDto) {
    if (await this.tagRepository.tagExists(createTagDto.tag))
      throw new BadRequestError('Tag já existe');
    const tag = new Tag();
    tag.tag = createTagDto.tag;
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

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.searchTag(id);
    if (await this.tagRepository.tagExists(updateTagDto.tag))
      throw new BadRequestError('Tag já existe');
    const updateTag = new Tag();
    updateTag.tag = updateTagDto.tag;
    return await this.tagRepository.update(tag, updateTag);
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

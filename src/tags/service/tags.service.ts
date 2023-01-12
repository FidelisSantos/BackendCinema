import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagsRepositoryService } from '../../shared/repositorys/tags-repository.service';
import { Tag } from '../entities/tag.entity';
import { FilmeRepositoryService } from '../../shared/repositorys/filme-repository.service';

@Injectable()
export class TagsService {
  constructor(
    private tagRepository: TagsRepositoryService,
    private filmeRepository: FilmeRepositoryService,
  ) {}

  async create(createTagDto: CreateTagDto) {
    if (await this.tagRepository.tagExists(createTagDto.tag))
      throw new HttpException('Tag já existe', HttpStatus.BAD_REQUEST);
    const tag = new Tag();
    tag.tag = createTagDto.tag;
    return await this.tagRepository.create(tag);
  }

  async findAll() {
    return await this.tagRepository.findAll();
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne(id);
    if (!tag)
      throw new HttpException('Tag não encontrada', HttpStatus.BAD_REQUEST);
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    const updateTag = new Tag();
    updateTag.tag = updateTagDto.tag;
    return await this.tagRepository.update(tag, updateTag);
  }

  async remove(id: number) {
    const tag = await this.tagRepository.findOne(id);
    if (await this.filmeRepository.useTag(tag))
      throw new HttpException('Tag em uso', HttpStatus.BAD_REQUEST);
    return this.tagRepository.remove(id);
  }
}

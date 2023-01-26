import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(tag: Tag) {
    return await this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: number) {
    return await this.tagRepository.findOneBy({ id });
  }

  async update(tag: Tag, newTag: string) {
    return await this.tagRepository.update(tag, { tag: newTag });
  }

  async remove(id: number) {
    return await this.tagRepository.delete(id);
  }

  async tagExists(tag: string) {
    return (await this.tagRepository.findBy({ tag })).length > 0;
  }

  async idExists(id: number) {
    return await this.tagRepository.findOneBy({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { Filme } from '../../filme/entities/filme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class FilmeRepositoryService {
  constructor(
    @InjectRepository(Filme)
    private filmeRepository: Repository<Filme>,
  ) {}

  async create(newFilme: Filme) {
    await this.filmeRepository.manager.save(newFilme);
    return await this.filmeRepository.save(newFilme);
  }

  async findAll() {
    return await this.filmeRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  async useTag(tags: Tag) {
    return (await this.filmeRepository.findBy({ tags })).length ? true : false;
  }

  async findOne(id: number) {
    return await this.filmeRepository.findOneBy({ id });
  }

  async update(filme: Filme, updateFilme: Filme) {
    await this.filmeRepository.manager.delete('filmeTags', {
      filmeId: filme.id,
    });
    await this.remove(filme);
    return await this.create(updateFilme);
  }

  async remove(removeFilme: Filme) {
    return await this.filmeRepository.delete({ id: removeFilme.id });
  }

  async exists(titulo: string) {
    return (await this.filmeRepository.findOneBy({ titulo })) ? true : false;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Injectable()
export class MovieRepository {
  constructor(
    @InjectRepository(Movie)
    private filmeRepository: Repository<Movie>,
  ) {}

  async create(newFilme: Movie) {
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

  async update(filme: Movie, updateFilme: Movie) {
    await this.filmeRepository.manager.delete('filmeTags', {
      filmeId: filme.id,
    });
    await this.remove(filme);
    return await this.create(updateFilme);
  }

  async remove(removeFilme: Movie) {
    return await this.filmeRepository.delete({ id: removeFilme.id });
  }

  async exists(titulo: string) {
    return (await this.filmeRepository.findOneBy({ titulo })) ? true : false;
  }
}

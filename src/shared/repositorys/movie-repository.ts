import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';

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

  async update(movie: Movie, updateMovie: Movie) {
    await this.filmeRepository.manager.delete('movieTags', {
      movieId: movie.id,
    });
    await this.remove(movie.id);
    return await this.create(updateMovie);
  }

  async remove(movieId: number) {
    return await this.filmeRepository.delete({ id: movieId });
  }

  async exists(titulo: string) {
    return (await this.filmeRepository.findOneBy({ title: titulo }))
      ? true
      : false;
  }
}

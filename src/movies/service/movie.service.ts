import { Injectable } from '@nestjs/common';
import { MovieDto } from '../dto/movie.dto';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { TagRepository } from '../..//shared/repositorys/tag-repository';
import { SessionRepository } from 'src/shared/repositorys/session-repository';
import { Tag } from 'src/shared/entities/tag.entity';
import { MappingService } from 'src/shared/mapping/mapping.service';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    private tagRepository: TagRepository,
    private sessionRepository: SessionRepository,
    private mapping: MappingService,
  ) {}

  async create(movieDto: MovieDto) {
    this.validateLink(movieDto.imageLink);
    this.validateTime(movieDto.movieTime);
    await this.validateTitle(movieDto.title);
    const tags = await this.searchTags(movieDto.tags);

    const movie = this.mapping.MovieDtoToMovie(movieDto, tags);
    return await this.movieRepository.create(movie);
  }

  async findAll() {
    return await this.movieRepository.findAll();
  }

  async update(id: number, movieDto: MovieDto) {
    const movie = await this.findOne(id);
    this.validateLink(movieDto.imageLink);
    this.validateTime(movieDto.movieTime);
    if (movieDto.title !== movie.title)
      await this.validateTitle(movieDto.title);
    await this.validateUpdateOrDelete(id);
    const tags = await this.searchTags(movieDto.tags);

    const updateMovie = this.mapping.MovieDtoToMovie(movieDto, tags);

    return await this.movieRepository.update(movie, updateMovie);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.validateUpdateOrDelete(id);
    return await this.movieRepository.remove(id);
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne(id);
    if (!movie) throw new NotFoundError('Filme não encontrado');
    return movie;
  }

  private validateLink(link: string) {
    const http = 'http://';
    const https = 'https://';
    if (!link.includes(http) && !link.includes(https))
      throw new BadRequestError('Imagem inválida');
  }

  private validateTime(time: number) {
    if (time <= 0) throw new BadRequestError('Tempo de filme inválido');
  }

  private async validateUpdateOrDelete(id: number) {
    if (await this.sessionRepository.useMovie(id))
      throw new BadRequestError('Filme cadastrado em uma sessão');
  }

  private async validateTitle(title: string) {
    if (await this.movieRepository.exists(title))
      throw new BadRequestError('Já existe filme com esse titulo');
  }

  private async searchTags(tags: number[]) {
    const searchTags: Tag[] = [];
    if (!tags.length) throw new NotFoundError('Tags vazias');
    for (let index = 0; index < tags.length; index++) {
      const tag = await this.tagRepository.findOne(tags[index]);
      if (!tag) {
        throw new NotFoundError('Tag não encontrada');
      }
      searchTags.push(tag);
    }
    return searchTags;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Movie } from '../entities/movie.entity';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { Tag } from '../../tags/entities/tag.entity';
import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { TagRepository } from '../..//shared/repositorys/tag-repository';
import { SessionRepository } from 'src/shared/repositorys/session-repository';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    private tagRepository: TagRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    this.validateLink(createMovieDto.linkImagem);
    this.validateTime(createMovieDto.tempoDeFilme);
    await this.validateTitle(createMovieDto.titulo);
    const tags = await this.searchTags(createMovieDto.tags);

    const movie = this.createMovie();
    movie.titulo = createMovieDto.titulo;
    movie.descricao = createMovieDto.descricao;
    movie.linkImagem = createMovieDto.linkImagem;
    movie.tempoDeFilme = createMovieDto.tempoDeFilme;
    movie.classificacao = createMovieDto.classificacao;
    movie.tags = tags;

    return await this.movieRepository.create(movie);
  }

  async findAll() {
    return await this.movieRepository.findAll();
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    this.validateLink(updateMovieDto.linkImagem);
    this.validateTime(updateMovieDto.tempoDeFilme);
    await this.validateTitle(updateMovieDto.titulo);
    const tags = await this.searchTags(updateMovieDto.tags);

    const updateMovie = this.createMovie();
    updateMovie.titulo = updateMovieDto.titulo;
    updateMovie.descricao = updateMovieDto.descricao;
    updateMovie.linkImagem = updateMovieDto.linkImagem;
    updateMovie.tempoDeFilme = updateMovieDto.tempoDeFilme;
    updateMovie.classificacao = updateMovieDto.classificacao;
    updateMovie.tags = tags;

    const movie = await this.findOne(id);

    return await this.movieRepository.update(movie, updateMovie);
  }

  async remove(id: number) {
    const filme = await this.findOne(id);
    await this.validateUpdateOrDelete(filme);
    return await this.movieRepository.remove(filme);
  }

  async findOne(id: number) {
    const filme = await this.movieRepository.findOne(id);
    if (!filme) throw new NotFoundError('Filme não encontrado');
    return filme;
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

  private async validateUpdateOrDelete(movie: Movie) {
    if (await this.sessionRepository.useMovie(movie))
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
    if (!searchTags.length) throw new NotFoundError('Tag não encontrada');
    return searchTags;
  }

  private createMovie() {
    return new Movie();
  }
}

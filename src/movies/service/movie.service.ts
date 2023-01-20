import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

import { Movie } from '../entities/movie.entity';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { TagsRepositoryService } from 'src/shared/repositorys/tags-repository.service';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { BadRequestError } from 'src/errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    private tagRepository: TagsRepositoryService,
    private sessaoRepository: SessaoRepositoryService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    this.validateLink(createMovieDto.linkImagem);
    this.validateTime(createMovieDto.tempoDeFilme);
    await this.validateTitle(createMovieDto.titulo);
    const tags = await this.searchTags(createMovieDto.tags);

    const movie = new Movie();
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

    const updateMovie = new Movie();
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
    if (await this.sessaoRepository.useFilme(movie))
      throw new BadRequestError('Filme cadastrado em uma sessão');
  }

  private async validateTitle(title: string) {
    if (await this.movieRepository.exists(title))
      throw new BadRequestError('Já existe filme com esse titulo');
  }

  private async searchTags(tags: number[]) {
    const searchTags: Tag[] = [];
    if (!tags.length) throw new NotFoundError('Tags vazias');
    tags.forEach(async (idTag) => {
      const tag = await this.tagRepository.findOne(idTag);
      if (!tag) throw new NotFoundError('Tag bçao encontrada');
      searchTags.push(tag);
    });

    return searchTags;
  }
}

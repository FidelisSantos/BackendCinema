import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateFilmeDto } from '../dto/create-filme.dto';
import { UpdateFilmeDto } from '../dto/update-filme.dto';

import { Filme } from '../entities/filme.entity';
import { FilmeValidationService } from '../validation/filme-validation.service';
import { FilmeRepositoryService } from '../../shared/repositorys/filme-repository.service';
import { TagsRepositoryService } from 'src/shared/repositorys/tags-repository.service';
import { SessaoRepositoryService } from 'src/shared/repositorys/sessao-repository.service';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class FilmeService {
  constructor(
    private filmeRepository: FilmeRepositoryService,
    private validation: FilmeValidationService,
    private tagRepository: TagsRepositoryService,
    private sessaoRepository: SessaoRepositoryService,
  ) {}

  async create(createFilme: CreateFilmeDto) {
    if (
      !(await this.validation.validateLink(createFilme.linkImagem)) ||
      !(await this.validation.validateTime(createFilme.tempoDeFilme))
    )
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);

    if (await this.filmeRepository.exists(createFilme.titulo))
      throw new HttpException(
        'Já existe filme com esse titulo',
        HttpStatus.BAD_REQUEST,
      );

    const filme = new Filme();
    filme.titulo = createFilme.titulo;
    filme.descricao = createFilme.descricao;
    filme.linkImagem = createFilme.linkImagem;
    filme.tempoDeFilme = createFilme.tempoDeFilme;
    filme.tags = [];
    createFilme.tags.forEach(async (idTag) => {
      const tag = await this.tagRepository.findOne(idTag);
      filme.tags.push(tag);
    });

    return await this.filmeRepository.create(filme);
  }

  async findAll() {
    return await this.filmeRepository.findAll();
  }

  async update(id: number, updateFilme: UpdateFilmeDto) {
    const searchTags: Tag[] = [];
    if (!updateFilme)
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
    const filme = await this.findOne(id);
    if (await this.sessaoRepository.useFilme(filme))
      throw new HttpException(
        'Filme cadastrado em uma sessão',
        HttpStatus.BAD_REQUEST,
      );
    const filmeUpdate = new Filme();
    if (updateFilme.titulo) filmeUpdate.titulo = updateFilme.titulo;
    if (updateFilme.descricao) filmeUpdate.descricao = updateFilme.descricao;
    if (updateFilme.linkImagem) {
      if (this.validation.validateLink(updateFilme.linkImagem))
        filmeUpdate.linkImagem = updateFilme.linkImagem;
      else throw new HttpException('Invalid Link', HttpStatus.BAD_REQUEST);
    }
    if (updateFilme.tempoDeFilme) {
      if (this.validation.validateTime(filmeUpdate.tempoDeFilme))
        filmeUpdate.tempoDeFilme = updateFilme.tempoDeFilme;
      else throw new HttpException('Invalid Time', HttpStatus.BAD_REQUEST);
    }
    filmeUpdate.tags = [];
    if (updateFilme.tags.length) {
      for (let index = 0; index < updateFilme.tags.length; index++) {
        const tag = await this.tagRepository.findOne(updateFilme.tags[index]);
        searchTags.push(tag);
      }
      filmeUpdate.tags = searchTags;
    }

    return await this.filmeRepository.update(filme, filmeUpdate);
  }

  async remove(id: number) {
    const filme = await this.findOne(id);
    if (await this.sessaoRepository.useFilme(filme))
      throw new HttpException(
        'Filme cadastrado em uma sessão',
        HttpStatus.BAD_REQUEST,
      );
    return await this.filmeRepository.remove(filme);
  }

  async findOne(id: number) {
    const filme = await this.filmeRepository.findOne(id);
    if (!filme)
      throw new HttpException('Filme não encontrado', HttpStatus.BAD_REQUEST);
    return filme;
  }
}

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

  async create(createFilmeDto: CreateFilmeDto) {
    if (
      !(await this.validation.validateLink(createFilmeDto.linkImagem)) ||
      !(await this.validation.validateTime(createFilmeDto.tempoDeFilme))
    )
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);

    if (await this.filmeRepository.exists(createFilmeDto.titulo))
      throw new HttpException(
        'Já existe filme com esse titulo',
        HttpStatus.BAD_REQUEST,
      );
    if (!createFilmeDto.tags.length)
      throw new HttpException('Tags vazias', HttpStatus.BAD_REQUEST);

    const filme = new Filme();
    filme.titulo = createFilmeDto.titulo;
    filme.descricao = createFilmeDto.descricao;
    filme.linkImagem = createFilmeDto.linkImagem;
    filme.tempoDeFilme = createFilmeDto.tempoDeFilme;
    filme.classificacao = createFilmeDto.classificacao;
    filme.tags = [];
    createFilmeDto.tags.forEach(async (idTag) => {
      const tag = await this.tagRepository.findOne(idTag);
      filme.tags.push(tag);
    });

    return await this.filmeRepository.create(filme);
  }

  async findAll() {
    return await this.filmeRepository.findAll();
  }

  async update(id: number, updateFilmeDto: UpdateFilmeDto) {
    const searchTags: Tag[] = [];
    if (!updateFilmeDto)
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
    const filme = await this.findOne(id);
    if (await this.sessaoRepository.useFilme(filme))
      throw new HttpException(
        'Filme cadastrado em uma sessão',
        HttpStatus.BAD_REQUEST,
      );
    const filmeUpdate = new Filme();
    if (updateFilmeDto.titulo) filmeUpdate.titulo = updateFilmeDto.titulo;
    if (updateFilmeDto.descricao)
      filmeUpdate.descricao = updateFilmeDto.descricao;
    if (updateFilmeDto.classificacao && +updateFilmeDto.classificacao != 0)
      filmeUpdate.classificacao = updateFilmeDto.classificacao;
    else filmeUpdate.classificacao = filme.classificacao;
    if (updateFilmeDto.linkImagem) {
      if (this.validation.validateLink(updateFilmeDto.linkImagem))
        filmeUpdate.linkImagem = updateFilmeDto.linkImagem;
      else throw new HttpException('Invalid Link', HttpStatus.BAD_REQUEST);
    }
    if (updateFilmeDto.tempoDeFilme) {
      if (this.validation.validateTime(filmeUpdate.tempoDeFilme))
        filmeUpdate.tempoDeFilme = updateFilmeDto.tempoDeFilme;
      else throw new HttpException('Invalid Time', HttpStatus.BAD_REQUEST);
    }
    filmeUpdate.tags = [];
    if (updateFilmeDto.tags.length > 0) {
      for (let index = 0; index < updateFilmeDto.tags.length; index++) {
        const tag = await this.tagRepository.findOne(
          updateFilmeDto.tags[index],
        );
        searchTags.push(tag);
      }
      filmeUpdate.tags = searchTags;
    } else {
      filmeUpdate.tags = filme.tags;
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

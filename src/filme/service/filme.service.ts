import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateFilmeDto } from '../dto/create-filme.dto';
import { UpdateFilmeDto } from '../dto/update-filme.dto';
import { FilmeRepositoryService } from '../repository/filme-repository.service';
import { Filme } from '../entities/filme.entity';
import { FilmeValidationService } from '../validation/filme-validation.service';

@Injectable()
export class FilmeService {
  constructor(
    private repository: FilmeRepositoryService,
    private validation: FilmeValidationService,
  ) {}

  async create(createFilme: CreateFilmeDto) {
    if (
      !(await this.validation.validateLink(createFilme.linkImagem)) ||
      !(await this.validation.validateTime(createFilme.tempoDeFilme))
    )
      throw new HttpException('Body invalid', HttpStatus.BAD_REQUEST);

    if (await this.repository.exists(createFilme.titulo))
      throw new HttpException(
        'Já existe filme com esse titulo',
        HttpStatus.BAD_REQUEST,
      );

    const filme = new Filme();
    filme.titulo = createFilme.titulo;
    filme.descricao = createFilme.descricao;
    filme.linkImagem = createFilme.linkImagem;
    filme.tempoDeFilme = createFilme.tempoDeFilme;
    filme.tags = createFilme.tags.join(', ');
    return await this.repository.create(filme);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async update(id: number, updateFilme: UpdateFilmeDto) {
    if (!updateFilme)
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
    const filme = await this.findOne(id);
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
    if (updateFilme.tags) filmeUpdate.tags = updateFilme.tags.join(', ');
    return await this.repository.update(filme, filmeUpdate);
  }

  async remove(id: number) {
    const filme = await this.findOne(id);
    await this.repository.remove(filme);
  }

  async findOne(id: number) {
    const filme = await this.repository.findOne(id);
    if (!filme)
      throw new HttpException('Filme não encontrado', HttpStatus.BAD_REQUEST);
    return filme;
  }
}

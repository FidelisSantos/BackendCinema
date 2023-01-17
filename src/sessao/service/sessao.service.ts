import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessaoDto } from '../dto/create-sessao.dto';
import { UpdateSessaoDto } from '../dto/update-sessao.dto';
import { SessaoRepositoryService } from '../../shared/repositorys/sessao-repository.service';
import { Sessao } from '../entities/sessao.entity';
import { FilmeSessao } from '../types/filmeSessao';
import { SessaoType } from '../types/SessaoType';
import { FilmeRepositoryService } from '../../shared/repositorys/filme-repository.service';
import { SalaRepositoryService } from '../../shared/repositorys/sala-repository.service';
import { SessaoValidationService } from '../validation/sessao-validation.service';

@Injectable()
export class SessaoService {
  constructor(
    private salaRepository: SalaRepositoryService,
    private filmeRepository: FilmeRepositoryService,
    private sessaoRepository: SessaoRepositoryService,
    private sessaoValidation: SessaoValidationService,
  ) {}

  async create(createSessao: CreateSessaoDto) {
    const timeNow = new Date(Date.now());
    const initSessao = new Date(createSessao.init);
    if (initSessao < timeNow)
      throw new HttpException(
        'Data/Hora de inicio inválida',
        HttpStatus.BAD_REQUEST,
      );
    if (initSessao.getTime() - timeNow.getTime() < 86400000)
      throw new HttpException(
        'Sessão tem que ser cadastrada um dia antes no mínimo',
        HttpStatus.BAD_REQUEST,
      );
    if (initSessao.getHours() < 10 || initSessao.getHours() >= 23)
      throw new HttpException(
        'O inicio da sessão tem que ser cadastrado entre as 10:00h e 22:59h',
        HttpStatus.BAD_REQUEST,
      );
    const sala = await this.salaRepository.findOne(createSessao.salaId);
    if (!sala)
      throw new HttpException('Sala não encontrada', HttpStatus.BAD_REQUEST);
    const filme = await this.filmeRepository.findOne(createSessao.filmeId);
    if (!filme)
      throw new HttpException('Filme não encontrado', HttpStatus.BAD_REQUEST);

    const sessoes = await this.sessaoRepository.findSalasNasSessoes(sala);
    if (sessoes.length) {
      if (
        !this.sessaoValidation.validateDateHourSessao(
          sessoes,
          createSessao,
          filme.tempoDeFilme,
        )
      )
        throw new HttpException(
          'Conflito com sessão já cadastrada',
          HttpStatus.BAD_REQUEST,
        );
    }
    const sessao = new Sessao();
    sessao.sala = sala;
    sessao.filme = filme;
    sessao.init = new Date(createSessao.init);
    sessao.finish = new Date(
      sessao.init.getTime() + filme.tempoDeFilme * 60000,
    );
    return await this.sessaoRepository.create(sessao);
  }

  async findAll() {
    return await this.sessaoRepository.findAll();
  }

  async findOne(id: number) {
    return await this.sessaoRepository.findOne(id);
  }

  async findFilmeSessoes() {
    const sessoes = await this.findAll();
    const filmeSessoes: FilmeSessao[] = [];
    for (let i = 0; i < sessoes.length; i++) {
      const index = filmeSessoes.findIndex(
        (filmeSessao) => filmeSessao.filme.id == sessoes[i].filme.id,
      );
      const sessao: SessaoType = {
        sessaoId: sessoes[i].id,
        salaId: sessoes[i].sala.id,
        inicio: sessoes[i].init,
        fim: sessoes[i].finish,
        status: sessoes[i].status,
      };
      if (index > 0) {
        filmeSessoes[index].sessoes.push(sessao);
      } else {
        const filmeSessao = new FilmeSessao();
        filmeSessao.filme = sessoes[i].filme;
        filmeSessao.sessoes = [];
        filmeSessao.sessoes.push(sessao);
        filmeSessoes.push(filmeSessao);
      }
    }
    return filmeSessoes;
  }

  async findFilmeSessao(filmeId: number) {
    return this.sessaoRepository.findFilmeSessao(filmeId);
  }

  async update(id: number, updateSessaoDto: UpdateSessaoDto) {
    const sessoesEdit: Sessao[] = [];
    const sessao = await this.findOne(id);
    const timeNow = new Date(Date.now());
    const initSessao = new Date(updateSessaoDto.init);
    if (initSessao < timeNow)
      throw new HttpException(
        'Data/Hora de inicio inválida',
        HttpStatus.BAD_REQUEST,
      );
    if (sessao.init < timeNow)
      throw new HttpException(
        'Não pode editar sessão que já terminou',
        HttpStatus.BAD_REQUEST,
      );
    if (!sessao)
      throw new HttpException('Sessão não encontrada', HttpStatus.BAD_REQUEST);
    const sala = await this.salaRepository.findOne(updateSessaoDto.salaId);
    if (!sala)
      throw new HttpException('Sala não encontrada', HttpStatus.BAD_REQUEST);
    const filme = await this.filmeRepository.findOne(updateSessaoDto.filmeId);
    if (!filme)
      throw new HttpException('Filme não encontrado', HttpStatus.BAD_REQUEST);
    const sessoes = await this.sessaoRepository.findSalasNasSessoes(sala);
    sessoes.forEach((sessao) => {
      if (sessao.id != id) sessoesEdit.push(sessao);
    });
    if (sessoes.length) {
      if (
        !this.sessaoValidation.validateDateHourSessao(
          sessoesEdit,
          updateSessaoDto,
          filme.tempoDeFilme,
        )
      )
        throw new HttpException(
          'Conflito com sessão já cadastrada',
          HttpStatus.BAD_REQUEST,
        );
    }
    const editSessao = new Sessao();
    editSessao.filme = filme;
    editSessao.sala = sala;
    if (sessao.status === 'Rodando') editSessao.init = new Date(Date.now());
    else if (updateSessaoDto.init)
      editSessao.init = new Date(updateSessaoDto.init);
    else editSessao.init = new Date(sessao.init);

    editSessao.finish = new Date(
      filme.tempoDeFilme * 60000 + editSessao.init.getTime(),
    );
    const maintenance = new Date(sessao.finish.getTime() + 1800 * 1000);
    if (sessao.finish <= editSessao.init && maintenance >= editSessao.init)
      throw new HttpException('Sala em manutenção', HttpStatus.BAD_REQUEST);
    await this.sessaoRepository.update(sessao, editSessao);
  }

  async remove(id: number) {
    const sessao = await this.sessaoRepository.findOne(id);
    const date = new Date(Date.now());
    if (sessao.init <= date && sessao.finish >= date)
      throw new HttpException(
        'Sessão em andamento não pode ser deletada',
        HttpStatus.BAD_REQUEST,
      );
    else this.sessaoRepository.remove(id);
  }
}

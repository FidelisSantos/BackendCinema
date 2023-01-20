import { Injectable } from '@nestjs/common';
import { CreateSessaoDto } from '../dto/create-sessao.dto';
import { UpdateSessaoDto } from '../dto/update-sessao.dto';
import { SessaoRepositoryService } from '../../shared/repositorys/sessao-repository.service';
import { Sessao } from '../entities/sessao.entity';
import { FilmeSessao } from '../types/filmeSessao';
import { SessaoType } from '../types/SessaoType';
import { MovieRepository } from '../../shared/repositorys/movie-repository';
import { RoomRepository } from '../../shared/repositorys/room-repository';
import { SessaoValidationService } from '../validation/sessao-validation.service';
import { BadRequestError } from 'src/errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';

@Injectable()
export class SessaoService {
  constructor(
    private roomRepository: RoomRepository,
    private movieRepository: MovieRepository,
    private sessaoRepository: SessaoRepositoryService,
    private sessaoValidation: SessaoValidationService,
  ) {}

  async create(createSessaoDto: CreateSessaoDto) {
    const timeNow = new Date(Date.now());
    const initSessao = new Date(createSessaoDto.init);
    let timeSessao = initSessao.getHours();
    if (timeSessao === 0) {
      timeSessao = 24;
    }
    if (initSessao < timeNow)
      throw new BadRequestError('Data/Hora de inicio inválida');
    if (initSessao.getTime() - timeNow.getTime() < 86400000)
      throw new BadRequestError(
        'Sessão tem que ser cadastrada um dia antes no mínimo',
      );
    if (timeSessao - 3 < 10 || timeSessao - 3 >= 23)
      throw new BadRequestError(
        'O inicio da sessão tem que ser cadastrado entre as 10:00h e 22:59h',
      );
    const { sala, filme } = await this.findSalaAndFilme(
      createSessaoDto.salaId,
      createSessaoDto.filmeId,
    );

    const sessoes = await this.sessaoRepository.findSalasNasSessoes(sala);
    if (sessoes.length) {
      if (
        !this.sessaoValidation.validateDateHourSessao(
          sessoes,
          createSessaoDto,
          filme.tempoDeFilme,
        )
      )
        throw new BadRequestError('Conflito com sessão já cadastrada');
    }
    const sessao = new Sessao();
    sessao.sala = sala;
    sessao.filme = filme;
    sessao.init = new Date(createSessaoDto.init);
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
      throw new BadRequestError('Data/Hora de inicio inválida');
    if (sessao.init < timeNow)
      throw new BadRequestError('Não pode editar sessão que já terminou');
    const { sala, filme } = await this.findSalaAndFilme(
      updateSessaoDto.salaId,
      updateSessaoDto.filmeId,
    );
    const sessoes = await this.sessaoRepository.findSalasNasSessoes(sala);
    if (!sessao) throw new BadRequestError('Sessão não encontrada');
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
        throw new BadRequestError('Conflito com sessão já cadastrada');
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
      throw new BadRequestError('Sala em manutenção');
    await this.sessaoRepository.update(sessao, editSessao);
  }

  async remove(id: number) {
    const sessao = await this.sessaoRepository.findOne(id);
    const date = new Date(Date.now());
    if (sessao.init <= date && sessao.finish >= date)
      throw new BadRequestError('Sessão em andamento não pode ser deletada');
    else this.sessaoRepository.remove(id);
  }

  async findSalaAndFilme(salaId: number, filmeId: number) {
    const sala = await this.roomRepository.findOne(salaId);
    if (!sala) throw new NotFoundError('Sala não encontrada');
    const filme = await this.movieRepository.findOne(filmeId);
    if (!filme) throw new NotFoundError('Filme não encontrado');

    return { sala, filme };
  }
}

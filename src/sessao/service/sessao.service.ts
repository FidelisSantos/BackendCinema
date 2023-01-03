import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateSessaoDto } from '../dto/create-sessao.dto';
import { UpdateSessaoDto } from '../dto/update-sessao.dto';
import { SessaoRepositoryService } from '../repository/sessao-repository.service';
import { Sessao } from '../entities/sessao.entity';
import { FilmeService } from 'src/filme/service/filme.service';
import { SalaService } from 'src/sala/service/sala.service';
import { Sala } from 'src/sala/entities/sala.entity';
import { StatusEnum } from 'src/sala/enum/status.Enum';

@Injectable()
export class SessaoService {
  constructor(
    private salaService: SalaService,
    private filmeService: FilmeService,
    private repository: SessaoRepositoryService,
  ) {
    this.updateStatus();
  }

  async updateStatus() {
    const sessoes = await this.findAll();
    sessoes.forEach(async (sessao) => {
      const today = new Date(Date.now());
      const dateInit = sessao.init;
      const dateFinish = sessao.finish;
      const maintenance = new Date(sessao.finish.getTime() + 1800 * 1000);
      console.log(today);
      console.log(dateInit);
      console.log(dateFinish);
      console.log(maintenance);
      if (dateInit <= today && dateFinish >= today) {
        console.log('Entrei 1-1');
        if (
          sessao.sala.sessaoId != sessao.id ||
          sessao.sala.status != StatusEnum.RUN
        ) {
          console.log('Entrei 1-2');
          await this.salaService.update(sessao.sala, StatusEnum.RUN, sessao.id);
        }
      } else if (dateFinish <= today && maintenance >= today) {
        console.log('Entrei 2-1');
        if (
          sessao.sala.sessaoId != sessao.id ||
          sessao.sala.status != StatusEnum.MAINTENANCE
        ) {
          console.log('Entrei 2-2');
          await this.salaService.update(
            sessao.sala,
            StatusEnum.MAINTENANCE,
            sessao.id,
          );
        }
      } else {
        console.log('Entrei 3-1');
        if (sessao.sala.sessaoId || sessao.sala.status != StatusEnum.FREE) {
          console.log('Entrei 3-2');
          await this.salaService.update(sessao.sala, StatusEnum.FREE, 0);
        }
      }
    });
  }

  async create(createSessao: CreateSessaoDto) {
    const today = new Date(Date.now());
    const initSessao = new Date(createSessao.init);
    if (today.getTime() - initSessao.getTime() <= 86400000)
      throw new HttpException(
        'Sessão tem que ser cadastrada um dia antes no mínimo',
        HttpStatus.BAD_REQUEST,
      );
    const { sala, filme } = await this.validateCreateSessao(createSessao);
    console.log(sala, filme);
    console.log(createSessao.init);
    const sessao = new Sessao();
    sessao.sala = sala;
    sessao.filme = filme;
    sessao.init = new Date(createSessao.init);
    console.log(sessao.init);
    sessao.finish = new Date(
      sessao.init.getTime() + filme.tempoDeFilme * 60000,
    );
    return await this.repository.create(sessao);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async findSalasNasSessoes(sala: Sala, id?: number) {
    const sessoes = await this.repository.findAll();
    const salaSessoes: Sessao[] = [];
    for (let index = 0; index < sessoes.length; index++) {
      if (sessoes[index].sala.id === sala.id) {
        if (!id || sessoes[index].id !== id) salaSessoes.push(sessoes[index]);
      }
    }
    console.log(salaSessoes);
    return salaSessoes;
  }

  async update(id: number, updateSessaoDto: UpdateSessaoDto) {
    const { sala, filme, sessao } = await this.validateEditSessao(
      updateSessaoDto,
      id,
    );
    console.log(sessao);
    if (!sala || !filme)
      throw new HttpException('Dados inválidos', HttpStatus.BAD_REQUEST);
    const editSessao = new Sessao();
    editSessao.filme = filme;
    editSessao.init = updateSessaoDto.init
      ? new Date(updateSessaoDto.init)
      : new Date(Date.now());
    editSessao.finish = new Date(
      filme.tempoDeFilme * 6000 + editSessao.init.getTime(),
    );
    const maintenance = new Date(sessao.finish.getTime() + 1800 * 1000);
    if (sessao.finish <= editSessao.init && maintenance >= editSessao.init)
      throw new HttpException('Sala em manutenção', HttpStatus.BAD_REQUEST);
    await this.repository.update(sessao, editSessao);
  }

  async remove(id: number) {
    const sessao = await this.repository.findOne(id);
    const date = new Date(Date.now());
    if (sessao.init <= date && sessao.finish >= date)
      throw new HttpException(
        'Sessão em andamento não pode ser deletada',
        HttpStatus.BAD_REQUEST,
      );
    else this.repository.remove(id);
  }

  private async validateCreateSessao(newSessao: CreateSessaoDto) {
    const sala = await this.salaService.findOne(newSessao.salaId);
    const filme = await this.filmeService.findOne(newSessao.filmeId);
    if (!sala || !filme)
      throw new HttpException('Body Inválido', HttpStatus.BAD_REQUEST);
    const salaSessoes = await this.findSalasNasSessoes(sala);
    if (!salaSessoes.length) return { sala, filme };
    if (this.validateDateHourSessao(salaSessoes, newSessao, filme.tempoDeFilme))
      return { sala, filme };
  }

  private async validateEditSessao(
    newSessao: Partial<CreateSessaoDto>,
    id: number,
  ) {
    const sessao = await this.findOne(id);
    if (!sessao)
      throw new HttpException('Sessão não encontrada', HttpStatus.BAD_REQUEST);
    const sala = await this.salaService.findOne(newSessao.salaId);
    const filme = await this.filmeService.findOne(newSessao.filmeId);
    if (!sala || !filme)
      throw new HttpException(
        'Sala ou Filme incorreto',
        HttpStatus.BAD_REQUEST,
      );
    const salaSessoes = await this.findSalasNasSessoes(sala, id);
    console.log(salaSessoes);
    if (!salaSessoes.length) return { sala, filme, sessao };
    if (!newSessao.init) newSessao.init = new Date(Date.now()).toString();
    if (this.validateDateHourSessao(salaSessoes, newSessao, filme.tempoDeFilme))
      return { sala, filme, sessao };
  }

  validateDateHourSessao(
    sessoes: Sessao[],
    newSessao: Partial<CreateSessaoDto>,
    tempoFilme: number,
  ) {
    const init = new Date(newSessao.init);
    const finish = new Date(tempoFilme * 60000 + init.getTime());
    const finishMaintenance = new Date(finish.getTime() + 1800 * 1000);
    console.log('finish', finishMaintenance);
    for (let index = 0; index < sessoes.length; index++) {
      const finishSessao = new Date(
        sessoes[index].finish.getTime() + 1800 * 1000,
      );
      const initSessao = sessoes[index].init;
      if (
        (init >= initSessao && init <= finishSessao) ||
        (finishMaintenance >= initSessao && finishMaintenance <= finishSessao)
      ) {
        throw new HttpException(
          'Conflito com sessão já cadastrada',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return true;
  }
}

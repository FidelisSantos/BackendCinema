import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateFilmeDto {
  @IsString()
  @Length(255)
  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  linkImagem: string;

  @IsString()
  @Length(10000)
  @IsNotEmpty()
  descricao: string;

  @IsPositive()
  @IsNotEmpty()
  tempoDeFilme: number;

  @IsNotEmpty()
  classificacao: string;

  @IsString()
  @IsArray()
  tags: number[];
}

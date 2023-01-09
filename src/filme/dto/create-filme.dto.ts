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
  @Length(255)
  @IsNotEmpty()
  descricao: string;

  @IsPositive()
  @IsNotEmpty()
  tempoDeFilme: number;

  @IsArray()
  tags: string[];
}

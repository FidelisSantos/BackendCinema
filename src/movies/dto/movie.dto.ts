import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MovieDto {
  @IsNotEmpty({ message: 'Filme tem que conter uma descrição' })
  @IsString({ message: 'Descrição inválida' })
  @MinLength(1, { message: 'Campo titulo inválido' })
  @MaxLength(255, { message: 'Campo titulo execeu numero de caracteres' })
  title: string;

  @IsNotEmpty({ message: 'Campo imagem obrigatório' })
  imageLink: string;

  @IsNotEmpty({ message: 'Campo descrição obrigatório' })
  @IsString({ message: 'Descrição inválida' })
  @MinLength(1, { message: 'Campo descrição inválido' })
  @MaxLength(10000, { message: 'Campo tags execeu numero de caracteres' })
  description: string;

  @IsNotEmpty({ message: 'Campo tempo de filme obrigatório' })
  @IsPositive({ message: 'Tempo de filme inválido' })
  movieTime: number;

  @IsNotEmpty({ message: 'Campo classificação obrigatório' })
  classification: string;

  @IsNotEmpty({ message: 'Campo tag obrigatório' })
  @IsArray({ message: 'Campo tag inválido' })
  tags: number[];
}

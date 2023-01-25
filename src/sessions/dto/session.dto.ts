import { IsNotEmpty, IsNumber } from 'class-validator';

export class SessionDto {
  @IsNotEmpty({ message: 'Campo sala obrigatório' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Campo sala inválido' },
  )
  salaId: number;

  @IsNotEmpty({ message: 'Campo sala obrigatório' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Campo sala inválido' },
  )
  filmeId: number;

  @IsNotEmpty({ message: 'Campo inicio obrigatório' })
  init: string;
}

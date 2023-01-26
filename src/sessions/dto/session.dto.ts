import { IsNotEmpty, IsNumber } from 'class-validator';

export class SessionDto {
  @IsNotEmpty({ message: 'Campo sala obrigatório' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Campo sala inválido' },
  )
  roomId: number;

  @IsNotEmpty({ message: 'Campo sala obrigatório' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Campo sala inválido' },
  )
  movieId: number;

  @IsNotEmpty({ message: 'Campo inicio obrigatório' })
  init: string;
}

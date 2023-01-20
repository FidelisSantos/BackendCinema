import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsNumber()
  salaId: number;

  @IsNotEmpty()
  @IsNumber()
  filmeId: number;

  @IsNumber()
  @IsNotEmpty()
  init: string;
}

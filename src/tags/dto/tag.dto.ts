import { IsNotEmpty, IsString } from 'class-validator';

export class TagDto {
  @IsNotEmpty({ message: 'Campo tag não pode ser nulo' })
  @IsString({ message: 'Campo tag inválido' })
  tag: string;
}

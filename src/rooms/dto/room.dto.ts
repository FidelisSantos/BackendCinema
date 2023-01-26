import { IsNotEmpty, IsString } from 'class-validator';
export class RoomDto {
  @IsNotEmpty({ message: 'Campo nome obrigatório' })
  @IsString({ message: 'Campo nome inválido' })
  name: string;
}

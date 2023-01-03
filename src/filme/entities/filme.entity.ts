import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Filme {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  titulo: string;

  @Column({ nullable: false })
  linkImagem: string;

  @Column({ nullable: false })
  descricao: string;

  @Column({ nullable: false })
  tempoDeFilme: number;

  @Column()
  tags: string;
}

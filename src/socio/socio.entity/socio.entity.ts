import { ClubEntity } from '../../club/club.entity/club.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('socio')
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombreUsuario: string;

  @Column()
  correo: string;

  @Column()
  fechaNacimiento: Date;

  @ManyToMany(() => ClubEntity, (club) => club.socios)
  @JoinTable()
  clubs: ClubEntity[];
}

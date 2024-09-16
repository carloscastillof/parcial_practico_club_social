import { SocioEntity } from '../../socio/socio.entity/socio.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('club')
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  fechaFundacion: string;

  @Column()
  imagen: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => SocioEntity, (socio) => socio.clubs)
  socios: SocioEntity[];
}

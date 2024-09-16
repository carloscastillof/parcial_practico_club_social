import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SocioClubService {
  constructor(
    @InjectRepository(SocioEntity)
    private socioRepository: Repository<SocioEntity>,

    @InjectRepository(ClubEntity)
    private clubRepository: Repository<ClubEntity>,
  ) {}

  async addMemberToClub(socioId: string, clubId: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'El club con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    socio.clubs = [...socio.clubs, club];
    return await this.socioRepository.save(socio);
  }

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'El club con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return club.socios;
  }

  async findMemberFromClub(
    socioId: string,
    clubId: string,
  ): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'El club con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const member: SocioEntity = club.socios.find(
      (socio) => socio.id === socioId,
    );
    if (!member)
      throw new BusinessLogicException(
        'El socio con el id dado no es miembro del club',
        BusinessError.NOT_FOUND,
      );
    return member;
  }

  async updateMembersFromClub(
    clubId: string,
    sociosId: string[],
  ): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'El club con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const socios: SocioEntity[] =
      await this.socioRepository.findByIds(sociosId);
    if (socios.length !== sociosId.length) {
      throw new BusinessLogicException(
        'Alguno de los socios con los ids dados no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    club.socios = socios;
    return await this.clubRepository.save(club);
  }

  async deleteMemberFromClub(socioId: string, clubId: string): Promise<void> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'El club con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    club.socios = club.socios.filter((socio) => socio.id !== socioId);
    await this.clubRepository.save(club);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity/socio.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private socioRepository: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find({
      relations: ['clubs'],
    });
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return socio;
  }

  async create(socio: SocioEntity): Promise<SocioEntity> {
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const persistedSocio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!persistedSocio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return await this.socioRepository.save({ ...persistedSocio, ...socio });
  }

  async delete(id: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socio)
      throw new BusinessLogicException(
        'El socio con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    await this.socioRepository.delete(socio);
  }
}

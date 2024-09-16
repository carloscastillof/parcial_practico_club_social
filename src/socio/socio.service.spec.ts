import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity/socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    sociosList = await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombreUsuario: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past().toISOString(),
        clubs: [],
      });
      sociosList.push(socio);
    }
    return sociosList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(5);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const categoria: SocioEntity = await service.findOne(storedSocio.id);
    expect(categoria).not.toBeNull();
    expect(categoria.nombreUsuario).toEqual(storedSocio.nombreUsuario);
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombreUsuario: faker.commerce.department(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
      clubs: [],
    };
    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();
    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: newSocio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario);
  });

  it('update should return an updated socio', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const updatedSocio: SocioEntity = {
      nombreUsuario: faker.commerce.department(),
      id: storedSocio.id,
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.past(),
      clubs: [],
    };
    const socio: SocioEntity = await service.update(
      updatedSocio.id,
      updatedSocio,
    );
    expect(socio).not.toBeNull();
    expect(socio.nombreUsuario).toEqual(updatedSocio.nombreUsuario);
  });

  it('update should throw an exception for an invalid socio id', async () => {
    await expect(() =>
      service.update('invalid-id', {
        id: '',
        nombreUsuario: faker.commerce.department(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past(),
        clubs: [],
      }),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no fue encontrado',
    );
  });

  it('delete should remove a socio', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    await service.delete(storedSocio.id);
    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: storedSocio.id },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio id', async () => {
    await expect(() => service.delete('invalid-id')).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no fue encontrado',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity/club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    clubsList = await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.company.name(),
        fechaFundacion: faker.date.past().toISOString(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.paragraph(),
        socios: [],
      });
      clubsList.push(club);
    }
    return clubsList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(5);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre);
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past().toISOString(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: [],
    };
    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();
    expect(newClub.nombre).toEqual(club.nombre);
    const storedClub: ClubEntity = await repository.findOne({
      where: { nombre: club.nombre },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
  });

  it('update should return an updated club', async () => {
    const storedClub: ClubEntity = clubsList[0];
    const updatedClub: ClubEntity = {
      nombre: faker.company.name(),
      id: storedClub.id,
      fechaFundacion: faker.date.past().toISOString(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: [],
    };
    const club: ClubEntity = await service.update(storedClub.id, updatedClub);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(updatedClub.nombre);
  });

  it('update should throw an error if the club does not exist', async () => {
    await expect(() =>
      service.update('invalid-id', {
        id: '',
        nombre: faker.company.name(),
        fechaFundacion: faker.date.past().toISOString(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.paragraph(),
        socios: [],
      }),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });

  it('delete should remove a club', async () => {
    const storedClub: ClubEntity = clubsList[0];
    await service.delete(storedClub.id);
    const club: ClubEntity = await repository.findOne({
      where: { id: storedClub.id },
    });
    expect(club).toBeNull();
  });

  it('delete should throw an error if the club does not exist', async () => {
    await expect(() => service.delete('invalid-id')).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });
});

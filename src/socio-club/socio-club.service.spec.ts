import { Test, TestingModule } from '@nestjs/testing';
import { SocioClubService } from './socio-club.service';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { ClubEntity } from '../club/club.entity/club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let sociosList: SocioEntity[];
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    socioRepository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await socioRepository.clear();
    await clubRepository.clear();

    sociosList = [];
    clubsList = [];

    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombreUsuario: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.past(),
        clubs: [],
      });
      sociosList.push(socio);
    }

    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await clubRepository.save({
        nombre: faker.commerce.department(),
        fechaFundacion: faker.date.past().toISOString(),
        imagen: faker.image.url(),
        descripcion: faker.commerce.productDescription(),
        socios: [],
      });
      clubsList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a socio to a club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubsList[0].id;

    const socio: SocioEntity = await service.addMemberToClub(socioId, clubId);

    expect(socio).not.toBeNull();
    expect(socio.clubs.length).toBe(1);
    expect(socio.clubs[0].id).toBe(clubId);
  });

  it('addMemberToClub should throw an exception for an invalid socio', async () => {
    const socioId: string = 'invalid-id';
    const clubId: string = clubsList[0].id;

    await expect(() =>
      service.addMemberToClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no fue encontrado',
    );
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = 'invalid-id';

    await expect(() =>
      service.addMemberToClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });

  it('findMembersFromClub should return socios from a club', async () => {
    const clubId: string = clubsList[0].id;
    const socio: SocioEntity = sociosList[0];

    await service.addMemberToClub(socio.id, clubId);

    const socios: SocioEntity[] = await service.findMembersFromClub(clubId);

    expect(socios).not.toBeNull();
    expect(socios.length).toBe(1);
    expect(socios[0].id).toBe(socio.id);
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    const clubId: string = 'invalid-id';

    await expect(() =>
      service.findMembersFromClub(clubId),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });

  it('findMemberFromClub should return a socio from a club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubsList[0].id;

    await service.addMemberToClub(socioId, clubId);

    const socio: SocioEntity = await service.findMemberFromClub(
      socioId,
      clubId,
    );

    expect(socio).not.toBeNull();
    expect(socio.id).toBe(socioId);
  });

  it('findMemberFromClub should throw an exception for an invalid socio', async () => {
    const socioId: string = 'invalid-id';
    const clubId: string = clubsList[0].id;

    await expect(() =>
      service.findMemberFromClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no fue encontrado',
    );
  });

  it('findMemberFromClub should throw an exception for an invalid club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = 'invalid-id';

    await expect(() =>
      service.findMemberFromClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });

  it('findMemberFromClub should throw an exception for a socio not in club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubsList[0].id;

    await expect(() =>
      service.findMemberFromClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no es miembro del club',
    );
  });

  it('updateMembersFromClub should update socios from a club', async () => {
    const clubId: string = clubsList[0].id;
    const sociosId: string[] = [sociosList[0].id, sociosList[1].id];

    await service.updateMembersFromClub(clubId, sociosId);
    expect((await service.findMembersFromClub(clubId)).length).toBe(2);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const clubId: string = 'invalid-id';
    const sociosId: string[] = [sociosList[0].id, sociosList[1].id];

    await expect(() =>
      service.updateMembersFromClub(clubId, sociosId),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });

  it('deleteMemberFromClub should remove a socio from a club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = clubsList[0].id;

    await service.addMemberToClub(socioId, clubId);
    expect((await service.findMembersFromClub(clubId)).length).toBe(1);

    await service.deleteMemberFromClub(socioId, clubId);

    const club: ClubEntity = await clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    expect(club.socios.length).toBe(0);
  });

  it('deleteMemberFromClub should throw an exception for an invalid socio', async () => {
    const socioId: string = 'invalid-id';
    const clubId: string = clubsList[0].id;

    await expect(() =>
      service.deleteMemberFromClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El socio con el id dado no fue encontrado',
    );
  });

  it('deleteMemberFromClub should throw an exception for an invalid club', async () => {
    const socioId: string = sociosList[0].id;
    const clubId: string = 'invalid-id';

    await expect(() =>
      service.deleteMemberFromClub(socioId, clubId),
    ).rejects.toHaveProperty(
      'message',
      'El club con el id dado no fue encontrado',
    );
  });
});

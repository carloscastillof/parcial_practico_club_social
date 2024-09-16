import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity/socio.entity';
import { ClubEntity } from 'src/club/club.entity/club.entity';
import { ClubModule } from 'src/club/club.module';
import { SocioModule } from 'src/socio/socio.module';
import { SocioClubController } from './socio-club.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocioEntity, ClubEntity]),
    ClubModule,
    SocioModule,
  ],
  providers: [SocioClubService],
  controllers: [SocioClubController],
})
export class SocioClubModule {}

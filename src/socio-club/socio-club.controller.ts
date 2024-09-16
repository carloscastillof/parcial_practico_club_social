import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioClubService } from './socio-club.service';

@Controller('socio-club')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
  constructor(private readonly socioClubService: SocioClubService) {}

  @Post('clubs/:clubId/members/:socioId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.addMemberToClub(clubId, socioId);
  }

  @Get('clubs/:clubId/members')
  async getMembersFromClub(@Param('clubId') clubId: string) {
    return await this.socioClubService.findMembersFromClub(clubId);
  }

  @Get('clubs/:clubId/members/:socioId')
  async getMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.findMemberFromClub(clubId, socioId);
  }

  @Put('clubs/:clubId/members')
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body('sociosIds') socioIds: string[],
  ) {
    return await this.socioClubService.updateMembersFromClub(clubId, socioIds);
  }

  @Delete('clubs/:clubId/members/:socioId')
  @HttpCode(204)
  async deleteMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.socioClubService.deleteMemberFromClub(clubId, socioId);
  }
}

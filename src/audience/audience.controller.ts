import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AudienceService } from './audience.service';
import { CreateAudienceDto } from 'src/dto/create-audience.dto';
import { TreatAudienceDto } from 'src/dto/treat-audience.dto';

@Controller('audience')
export class AudienceController {
  constructor(private audienceService: AudienceService) {}

  //Getting all the audience
  @Get('/all')
  async getAllAudience() {
    return await this.audienceService.getAllAudience();
  }

  //Count all the audience
  @Get('/count/all')
  async countAllAudience() {
    return await this.audienceService.countAllAudience();
  }

  //Count audience by status
  @Get('/count/status/:status_audience')
  async countAudienceByStatus(
    @Param('status_audience') status_audience: string,
  ) {
    return await this.audienceService.countAudienceByStatus(status_audience);
  }

  //Get all audience by status
  @Get('/status/:status_audience')
  async getAudienceByStatus(@Param('status_audience') status_audience: string) {
    return await this.audienceService.getAudienceByStatus(status_audience);
  }

  //Get a user's audience
  @Get('/user/:user')
  async getAudienceByUser(@Param('user') user: string) {
    return await this.audienceService.getAudienceByUser(user);
  }

  //Count a user's audience
  @Get('/count/user/:user')
  async countAudienceByUser(@Param('user') user: string) {
    return await this.audienceService.countAudienceByUser(user);
  }

  //Create audience
  @Post('/create')
  async createAudience(@Body() createAudienceDto: CreateAudienceDto) {
    return await this.audienceService.createAudience(createAudienceDto);
  }

  //Treat audience
  @Patch('/treat/:id')
  async treatAudience(
    @Param('id') id: string,
    @Body() treatAudienceDto: TreatAudienceDto,
  ) {
    return await this.audienceService.treatAudience(id, treatAudienceDto);
  }
}

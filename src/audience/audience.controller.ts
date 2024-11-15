import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AudienceService } from './audience.service';
import { CreateAudienceDto } from 'src/dto/create-audience.dto';
import { TreatAudienceDto } from 'src/dto/treat-audience.dto';
import { AvailabilityService } from 'src/availability/availability.service';
import { AuthService } from 'src/auth/auth.service';
import { RequestService } from 'src/request/request.service';

@Controller('audience')
export class AudienceController {
  constructor(
    private audienceService: AudienceService,
    private availabilityService: AvailabilityService,
    private userService: AuthService,
    private requestService: RequestService,
  ) {}

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

  //Get audience by id
  @Get('/get/:id')
  async getAudienceById(@Param('id') id: string) {
    return await this.audienceService.getAudiencebyId(id);
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
    // Getting the detail for mailing
    const usr = await this.userService.getUserByIdForMailing(
      createAudienceDto.user,
    );
    const req = await this.requestService.getRequestById(
      createAudienceDto.request,
    );
    const ava = await this.availabilityService.getAvailabilityById(
      createAudienceDto.availability,
    );
    // Creating audience
    const response = await this.audienceService.createAudience(
      createAudienceDto,
      usr,
      req,
      ava,
    );
    // Changing the availability status
    await this.availabilityService.changeAvailabilityStatusToOccuped(
      createAudienceDto.availability,
    );

    return response;
  }

  //Treat audience
  @Patch('/cancel/:id')
  async treatAudience(@Param('id') id: string) {
    // Getting the audience
    const audi = await this.audienceService.getAudiencebyId(id);
    // Getting detail for mailing
    const usr = await this.userService.getUserByIdForMailing(audi.user);
    const req = await this.requestService.getRequestById(audi.request);
    const ava = await this.availabilityService.getAvailabilityById(
      audi.availability,
    );
    // Treating audience
    const response = await this.audienceService.treatAudience(
      id,
      usr,
      req,
      ava,
    );
    // Changing the availability status
    await this.availabilityService.changeAvailabilityStatusToOccuped(
      audi.availability,
    );

    return response;
  }

  //Treat audience
  @Patch('/report/:id')
  async reportAudience(@Param('id') id: string, @Body() availability: any) {
    return await this.audienceService.reportAudience(id, availability);
  }
}

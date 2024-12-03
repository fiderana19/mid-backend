import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AudienceService } from './audience.service';
import { CreateAudienceDto } from 'src/dto/create-audience.dto';
import { AvailabilityService } from 'src/availability/availability.service';
import { AuthService } from 'src/auth/auth.service';
import { RequestService } from 'src/request/request.service';
import { ReportAudienceDto } from 'src/dto/report-audience.dto';
import { SearchAudienceDto } from 'src/dto/search-audience.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

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
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllAudience() {
    return await this.audienceService.getAllAudience();
  }

  //Getting the last audience
  @Get('/last')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getLastAudience() {
    return await this.audienceService.getLastAudience();
  }

  //Count all the audience
  @Get('/count/all')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async countAllAudience() {
    return await this.audienceService.countAllAudience();
  }

  //Get audience by id
  @Get('/get/:id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAudienceById(@Param('id') id: string) {
    return await this.audienceService.getAudiencebyId(id);
  }

  //Get audience by ref
  @Get('/ref/:ref_audience')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAudienceByRef(@Param('ref_audience') ref_audience: string) {
    return await this.audienceService.getAudienceByRef(ref_audience);
  }

  //Get audience for chart
  @Get('/chart')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAudienceForChart() {
    return await this.audienceService.getAudienceForChart();
  }

  //Search audience
  @Post('/search')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async searchAudienceBetweenDates(
    @Body() searchAudienceDto: SearchAudienceDto,
  ) {
    return await this.audienceService.getSearchAudience(searchAudienceDto);
  }

  //Count audience by status
  @Get('/count/status/:status_audience')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async countAudienceByStatus(
    @Param('status_audience') status_audience: string,
  ) {
    return await this.audienceService.countAudienceByStatus(status_audience);
  }

  //Get all audience by status
  @Get('/status/:status_audience')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAudienceByStatus(@Param('status_audience') status_audience: string) {
    return await this.audienceService.getAudienceByStatus(status_audience);
  }

  //Get a user's audience
  @Get('/user/:user')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAudienceByUser(@Param('user') user: string) {
    return await this.audienceService.getAudienceByUser(user);
  }

  //Count a user's audience
  @Get('/count/user/:user')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async countAudienceByUser(@Param('user') user: string) {
    return await this.audienceService.countAudienceByUser(user);
  }

  //Create audience
  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async reportAudience(
    @Param('id') id: string,
    @Body() reportAudienceDto: ReportAudienceDto,
  ) {
    // Getting the audience
    const audi = await this.audienceService.getAudiencebyId(id);
    // Getting detail for mailing
    const req = await this.requestService.getRequestById(audi.request);
    const old_ava = await this.availabilityService.getAvailabilityById(
      reportAudienceDto.old_availability,
    );
    const new_ava = await this.availabilityService.getAvailabilityById(
      reportAudienceDto.new_availability,
    );
    // Changing the availability status
    await this.availabilityService.changeAvailabilityStatusToOccuped(
      reportAudienceDto?.new_availability,
    );
    // Changing the availability status
    await this.availabilityService.changeAvailabilityStatusToCanceled(
      reportAudienceDto?.old_availability,
    );
    return await this.audienceService.reportAudience(
      id,
      reportAudienceDto,
      req,
      old_ava,
      new_ava,
      audi,
    );
  }

  //Close audience
  @Patch('/close/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async closeAudience(@Param('id') id: string) {
    return this.audienceService.closeAudience(id);
  }

  //Missed audience
  @Patch('/missed/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async missedAudience(@Param('id') id: string) {
    return this.audienceService.missingAudience(id);
  }
}

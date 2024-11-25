import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from 'src/dto/create-availability.dto';
import { UpdateAvailabilityDto } from 'src/dto/update-availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Audience } from 'src/schema/audience.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'src/schema/request.schema';
import { User } from 'src/schema/user.schema';
import { AudienceService } from 'src/audience/audience.service';
import { AuthService } from 'src/auth/auth.service';
import { RequestService } from 'src/request/request.service';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private availabilityService: AvailabilityService,
    private audienceService: AudienceService,
    private userService: AuthService,
    private requestService: RequestService,
    @InjectModel(Audience.name)
    private audienceModel: Model<Audience>,
  ) {}

  //Get all availability
  @Get('/all')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllAvailability() {
    return await this.availabilityService.getAllAvailability();
  }

  //Get all free availability
  @Get('/all/free')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllFreeAvailability() {
    return await this.availabilityService.getAllFreeAvailability();
  }

  //Create availability
  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAvailability(@Body() createAvailability: CreateAvailabilityDto) {
    return await this.availabilityService.createAvailability(
      createAvailability,
    );
  }

  //Treat request
  @Patch('/status/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateAvailabilityStatus(
    @Param('id') id: string,
    @Body() treatRequestDto: UpdateAvailabilityDto,
  ) {
    const ava = await this.availabilityService.getAvailabilityById(id);
    const audience = await this.audienceService.getAudienceByAvailability(id);
    if(audience) {
      const audi = String(audience._id);
      const request = String(audience.request);
      const user = String(audience.user);
      const usr = await this.userService.getUserByIdForMailing(user);
      const req = await this.requestService.getRequestById(request); 
      
      return await this.availabilityService.updateAvailabilityStatus(
        id,
        treatRequestDto,
        usr,
        ava,
        req,
        audi
      );
    } else {
      const usr = '';
      const req = '';
      const audi = '';
      return await this.availabilityService.updateAvailabilityStatus(
        id,
        treatRequestDto,
        usr,
        ava,
        req,
        audi
      );  
    }
  }

  //Get availability by id
  @Get('/get/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAvailabilityById(@Param('id') id: string) {
    return await this.availabilityService.getAllAvailabilityById(id);
  }

  //Update availability
  @Patch('/update/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateAvailability(
    @Param('id') id: string,
    @Body() updateAvailability: UpdateAvailabilityDto,
  ) {
    return await this.availabilityService.updateAvailability(
      id,
      updateAvailability,
    );
  }

  //Delete availability
  @Delete('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteAvailability(@Param('id') id: string) {
    return await this.availabilityService.deleteAvailability(id);
  }
}

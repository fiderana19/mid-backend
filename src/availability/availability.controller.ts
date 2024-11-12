import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from 'src/dto/create-availability.dto';
import { UpdateAvailabilityDto } from 'src/dto/update-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  //Get all availability
  @Get('/all')
  async getAllAvailability() {
    return await this.availabilityService.getAllAvailability();
  }

  //Get all free availability
  @Get('/all/free')
  async getAllFreeAvailability() {
    return await this.availabilityService.getAllFreeAvailability();
  }

  //Create availability
  @Post('/create')
  async createAvailability(@Body() createAvailability: CreateAvailabilityDto) {
    return await this.availabilityService.createAvailability(
      createAvailability,
    );
  }

  //Treat request
  @Patch('/status/:id')
  async updateAvailabilityStatus(
    @Param('id') id: string,
    @Body() treatRequestDto: UpdateAvailabilityDto,
  ) {
    return await this.availabilityService.updateAvailabilityStatus(
      id,
      treatRequestDto,
    );
  }

  //Get availability by id
  @Get('/get/:id')
  async getAvailabilityById(@Param('id') id: string) {
    return await this.availabilityService.getAllAvailabilityById(id);
  }

  //Update availability
  @Patch('/update/:id')
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
  async deleteAvailability(@Param('id') id: string) {
    return await this.availabilityService.deleteAvailability(id);
  }
}

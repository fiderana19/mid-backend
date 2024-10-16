import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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

    //Create availability
    @Post('/create')
    async createAvailability(
        @Body() createAvailability: CreateAvailabilityDto,
    ) {
        return await this.availabilityService.createAvailability(createAvailability);
    }

    //Update availability
    @Patch('/update/:id')
    async updateAvailability(
        @Param('id') id: string,
        @Body() updateAvailability: UpdateAvailabilityDto 
    ) {
        return await this.availabilityService.updateAvailability(id, updateAvailability);
    }

    //Delete availability
    @Delete('/delete/:id')
    async deleteAvailability(
        @Param('id') id: string
    ) {
        return await this.availabilityService.deleteAvailability(id);
    }
}

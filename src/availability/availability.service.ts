import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Availability } from 'src/schema/availability.schema';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectModel(Availability.name)
        private availabilityModel: Model<Availability>,
    ) {}

    //Get all availbility
    async getAllAvailability(): Promise<Availability[]> {
        return await this.availabilityModel.find();
    }

    //Create availability
    async createAvailability(createAvailabilityDto) {
        return await this.availabilityModel.create(createAvailabilityDto);
    }

    //Update availability
    async updateAvailability(id: string, updateAvailabilityDto) {
        return await this.availabilityModel.findByIdAndUpdate(id, updateAvailabilityDto, { new: true }).exec();
    }

    //Delete availability
    async deleteAvailability(id:string) {
        return await this.availabilityModel.findByIdAndDelete(id).exec();
    }
}

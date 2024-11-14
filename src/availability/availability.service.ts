import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudienceService } from 'src/audience/audience.service';
import { AvailabilityStatus } from 'src/enums/availability.enum';
import { mapAvailability, mapSingleAvailability } from 'src/mappers/availability.mapper';
import { Availability } from 'src/schema/availability.schema';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private availabilityModel: Model<Availability>,
    private audienceService: AudienceService,
  ) {}

  //Get all availbility
  async getAllAvailability(): Promise<Availability[]> {
    const ava = await this.availabilityModel.find();
    return mapAvailability(ava);
  }

  //Get availbility
  async getAvailabilityById(id: string): Promise<any> {
    const ava = await this.availabilityModel.findById(id);
    return mapSingleAvailability(ava);
  }

  //Get all free availbility
  async getAllFreeAvailability(): Promise<Availability[]> {
    const ava = await this.availabilityModel.find({ status_availability: "Libre" });
    return mapAvailability(ava);
  }

  //Change availability status
  async updateAvailabilityStatus(id: string, updateAvailabilityStatusDto) {
    console.log(updateAvailabilityStatusDto);
    if(updateAvailabilityStatusDto.status_availability === "Annulé") {
      await this.audienceService.cancelAudience(id);
    }
    return await this.availabilityModel
      .findByIdAndUpdate(id, updateAvailabilityStatusDto, { new: true })
      .exec();
  }

  //Get availbility by id
  async getAllAvailabilityById(id: string): Promise<Availability> {
    return await this.availabilityModel.findById(id);
  }

  //Create availability
  async createAvailability(createAvailabilityDto) {
    return await this.availabilityModel.create(createAvailabilityDto);
  }

  //Update availability
  async updateAvailability(id: string, updateAvailabilityDto) {
    return await this.availabilityModel
      .findByIdAndUpdate(id, updateAvailabilityDto, { new: true })
      .exec();
  }

  //Delete availability
  async deleteAvailability(id: string) {
    return await this.availabilityModel.findByIdAndDelete(id).exec();
  }

  //Change availability status after audience created
  async changeAvailabilityStatusToOccuped(id: string) {
    await this.availabilityModel.findByIdAndUpdate(id, {status_availability: AvailabilityStatus.Occuped}).exec();
  }
}

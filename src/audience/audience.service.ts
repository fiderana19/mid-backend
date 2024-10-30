import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audience } from 'src/schema/audience.schema';

@Injectable()
export class AudienceService {
  constructor(
    @InjectModel(Audience.name)
    private audienceModel: Model<Audience>,
  ) {}

  //Get all audience
  async getAllAudience() {
    return await this.audienceModel.find();
  }

  //Create audience
  async createAudience(createAudienceDto) {
    return await this.audienceModel.create(createAudienceDto);
  }

  //Treating audience status
  async treatAudience(id: string, status_audience) {
    return await this.audienceModel
      .findByIdAndUpdate(id, status_audience, { new: true })
      .exec();
  }

  //Count all audience
  async countAllAudience() {
    return await this.audienceModel.countDocuments();
  }

  //Get audience by status
  async getAudienceByStatus(status_audience) {
    return await this.audienceModel.find({ status_audience }).exec();
  }

  //Count audience by status
  async countAudienceByStatus(status_audience) {
    return await this.audienceModel
      .find({ status_audience })
      .countDocuments()
      .exec();
  }

  //Get audience by user
  async getAudienceByUser(user) {
    return await this.audienceModel.find({ user }).exec();
  }

  //Count audience by user
  async countAudienceByUser(user) {
    return await this.audienceModel.find({ user }).countDocuments().exec();
  }
}

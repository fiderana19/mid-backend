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
    const audiences = await this.audienceModel.find()
      .populate('user', 'nom')
      .populate('availability','date_availability hour_debut hour_end')
      .populate('request','object')
      .exec();
    return audiences.map((audi)=> {
      return({
        audi_status: audi.status_audience,
        availability_date: audi.availability ? audi.availability.date_availability : '',
        availability_hour_debut: audi.availability ? audi.availability.hour_debut : '',
        availability_hour_end: audi.availability ? audi.availability.hour_end : '',
        usr: audi.user ? audi.user.nom : '',
        reqhureh: audi.request ? audi.request.object : '',
      })
    })
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

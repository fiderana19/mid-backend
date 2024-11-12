import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudienceStatus } from 'src/enums/audiencestatus.enum';
import { mapAudience, mapSingleAudience } from 'src/mappers/audience.mapper';
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
      .populate('user', '_id nom prenom email cni telephone adresse profile_photo')
      .populate('availability','_id date_availability hour_debut hour_end')
      .populate('request','_id object type_request')
      .exec();
    return mapAudience(audiences);
  }

  async getAudiencebyId(id: string) {
    const audience = await this.audienceModel.findById(id)
      .populate('user', '_id nom prenom email cni telephone adresse profile_photo')
      .populate('availability','_id date_availability hour_debut hour_end')
      .populate('request','_id object type_request')
      .exec();
    return mapSingleAudience(audience);
  }

  //Create audience
  async createAudience(createAudienceDto) {
    const {request, availability, user} = createAudienceDto;
    const ref_audience: string = 'ref';
    return await this.audienceModel.create({
      ref_audience,
      request,
      availability,
      user,
    });
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

  //Delete request by user id
  async deleteManyAudienceByUserId(user: string) {
    await this.audienceModel
      .deleteMany({ user })
      .exec();
  }

  //Cancel status by availability id
  async cancelAudience(availability: string) {
    const audi = await this.audienceModel.find({ availability }).exec();
    const id = audi[0]._id;
    console.log(id);
    await this.audienceModel.findByIdAndUpdate(id, {status_audience: AudienceStatus.Canceled}).exec();
  }
}

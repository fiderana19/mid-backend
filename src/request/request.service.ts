import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestStatus } from 'src/enums/requeststatuts.enum';
import { mapRequest, mapSingleRequest } from 'src/mappers/request.mapper';
import { Request } from 'src/schema/request.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
  ) {}

  //Get all request
  async getRequest(): Promise<any> {
    const req = await this.requestModel
      .find()
      .populate('user', '_id nom prenom cni adresse email telephone profile_photo')
      .exec();

    return mapRequest(req);
  }

  //Get request by id
  async getRequestById(id: string): Promise<any> {
    const req = await this.requestModel
      .findById(id)
      .populate('user', '_id nom prenom cni adresse email telephone profile_photo')
      .exec();

    return mapSingleRequest(req);
  }

  //Create request
  async createRequest(createRequestDto, user: User) {
    const data = Object.assign(createRequestDto, { user: user._id });

    return await this.requestModel.create(data);
  }

  //Get request by user
  async getRequestByUser(user: string) {
    const req = await this.requestModel.find({ user })
    .populate('user', '_id nom prenom cni adresse email telephone profile_photo')
    .exec();
    return mapRequest(req);
  }

  //Count request by user
  async countRequestByUser(user: string) {
    return await this.requestModel.find({ user }).countDocuments().exec();
  }

  //Treat request
  async treatRequest(id: string, treatRequestDto) {
    return await this.requestModel
      .findByIdAndUpdate(id, treatRequestDto, { new: true })
      .exec();
  }

  //Update request
  async updateRequest(id: string, updateRequestDto) {
    const requete = await this.requestModel.findById(id);

    if (requete.status_request == RequestStatus.Accepted) {
      throw new UnauthorizedException('Ce demande est déjà approuvée');
    }

    return await this.requestModel
      .findByIdAndUpdate(id, updateRequestDto, { new: true })
      .exec();
  }

  //Delete request
  async deleteRequest(id: string) {
    const requete = await this.requestModel.findById(id);

    if (requete.status_request == RequestStatus.Accepted) {
      throw new UnauthorizedException('Ce demande est déjà approuvée');
    }

    return await this.requestModel.findByIdAndDelete(id).exec();
  }

  //Get request by status
  async getRequestByStatus(status_request: string) {
    return await this.requestModel.find({ status_request }).exec();
  }

  //Count all request
  async countAllRequest() {
    return await this.requestModel.countDocuments().exec();
  }

  //Count request by status
  async countRequestByStatus(status_request: string) {
    return await this.requestModel
      .find({ status_request })
      .countDocuments()
      .exec();
  }

  //Delete request by user id
  async deleteManyRequestByUserId(user: string) {
    await this.requestModel
      .deleteMany({ user })
      .exec();
  }
}

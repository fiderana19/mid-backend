import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestStatus } from 'src/enums/requeststatuts.enum';
import { mapRequest, mapSingleRequest } from 'src/mappers/request.mapper';
import { Audience } from 'src/schema/audience.schema';
import { Request } from 'src/schema/request.schema';
import { User } from 'src/schema/user.schema';
import { formatDate } from 'src/utils/dateformatter';
import { setDenyRequestMail } from 'src/utils/setDenyRequestMail';
import { setRequestApprovalMail } from 'src/utils/setRequestApprovalMail';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
    @InjectModel(Audience.name)
    private audienceModel: Model<Audience>,
    private mailerService: MailerService,
  ) {}

  //Get all request
  async getRequest(): Promise<any> {
    const req = await this.requestModel
      .find()
      .sort({ request_creation: -1 })
      .populate(
        'user',
        '_id nom prenom cni adresse email telephone profile_photo',
      )
      .exec();

    return mapRequest(req);
  }

  //Get accepted request not organized
  async getNotOrganizedRequest(): Promise<any> {
    const requests = await this.audienceModel.distinct('request');

    const response = await this.requestModel
      .find({
        status_request: RequestStatus.Accepted,
        _id: { $nin: requests },
      })
      .sort({ request_creation: -1 })
      .populate(
        'user',
        '_id nom prenom cni adresse email telephone profile_photo',
      );

    return mapRequest(response);
  }

  //Get request by id
  async getRequestById(id: string): Promise<any> {
    const req = await this.requestModel
      .findById(id)
      .populate(
        'user',
        '_id nom prenom cni adresse email telephone profile_photo',
      )
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
    const req = await this.requestModel
      .find({ user })
      .populate(
        'user',
        '_id nom prenom cni adresse email telephone profile_photo',
      )
      .exec();
    return mapRequest(req);
  }

  //Count request by user
  async countRequestByUser(user: string) {
    return await this.requestModel.find({ user }).countDocuments().exec();
  }

  //Treat request
  async acceptRequest(id: string, treatRequestDto) {
    // Getting the request detail
    const req = await this.requestModel
      .findById(id)
      .populate('user', ' nom prenom email')
      .exec();

    const {
      type_request,
      date_wanted_debut,
      date_wanted_end,
      request_creation,
    } = req;
    const debut = formatDate(date_wanted_debut);
    const end = formatDate(date_wanted_end);
    const creation = formatDate(request_creation);
    const { nom, prenom, email } = req.user;

    const mailBody = setRequestApprovalMail(
      nom,
      prenom,
      creation,
      type_request,
      debut,
      end,
    );
    // Accepting request
    const response = await this.requestModel
      .findByIdAndUpdate(id, treatRequestDto, { new: true })
      .exec();

    // Sending mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Demande approuvée',
      html: mailBody,
      attachDataUrls: true,
      attachments: [
        {
          filename: 'mid-logo.jpg',
          path: '../mid-backend/src/assets/mid-logo.jpg',
          cid: 'mid',
        },
      ],
    });

    return response;
  }

  //Treat request
  async denyRequest(id: string, treatRequestDto) {
    // Getting the request detail
    const req = await this.requestModel
      .findById(id)
      .populate('user', ' nom prenom email')
      .exec();

    const {
      type_request,
      date_wanted_debut,
      date_wanted_end,
      request_creation,
    } = req;
    const { nom, prenom, email } = req.user;
    const debut = formatDate(date_wanted_debut);
    const end = formatDate(date_wanted_end);
    const creation = formatDate(request_creation);

    const mailBody = setDenyRequestMail(
      nom,
      prenom,
      creation,
      type_request,
      debut,
      end,
    );
    // Denying request
    const response = await this.requestModel
      .findByIdAndUpdate(id, treatRequestDto, { new: true })
      .exec();
    // Seding mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Demande réfusée',
      html: mailBody,
      attachDataUrls: true,
      attachments: [
        {
          filename: 'mid-logo.jpg',
          path: '../mid-backend/src/assets/mid-logo.jpg',
          cid: 'mid',
        },
      ],
    });
    return response;
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
    await this.requestModel.deleteMany({ user }).exec();
  }

  //Get request for chart
  async getRequestForChart() {
    const total_accepted = await this.requestModel
      .find({ status_request: RequestStatus.Accepted })
      .countDocuments()
      .exec();
    const total_waiting = await this.requestModel
      .find({ status_request: RequestStatus.Waiting })
      .countDocuments()
      .exec();
    const total_denied = await this.requestModel
      .find({ status_request: RequestStatus.Denied })
      .countDocuments()
      .exec();

    return { total_accepted, total_waiting, total_denied };
  }
}

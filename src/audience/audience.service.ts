import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudienceStatus } from 'src/enums/audiencestatus.enum';
import { mapAudience, mapSingleAudience } from 'src/mappers/audience.mapper';
import { Audience } from 'src/schema/audience.schema';
import { generateRandomRef } from 'src/utils/generateRandom';
import * as qrcode from 'qrcode';
import { setOrganizeAudienceMail } from 'src/utils/setOrganiseAudienceMail';
import { setCancelAudienceMail } from 'src/utils/setCancelAudienceMail';
import { ReportAudienceDto } from 'src/dto/report-audience.dto';
import { setReportAudienceMail } from 'src/utils/setReportAudienceMail';

@Injectable()
export class AudienceService {
  constructor(
    @InjectModel(Audience.name)
    private audienceModel: Model<Audience>,
    private mailerService: MailerService,
  ) {}

  //Get all audience
  async getAllAudience() {
    const audiences = await this.audienceModel
      .find()
      .sort({ audience_creation: -1 })
      .populate(
        'user',
        '_id nom prenom email cni telephone adresse profile_photo',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate('request', '_id object request_creation type_request')
      .exec();

    return mapAudience(audiences);
  }

  //Get last audience
  async getLastAudience() {
    const audiences = await this.audienceModel
      .findOne()
      .sort({ audience_creation: -1 })
      .populate(
        'user',
        '_id nom prenom email cni telephone adresse profile_photo',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate('request', '_id object request_creation type_request')
      .exec();

    if (audiences) {
      return mapSingleAudience(audiences);
    } else {
      return audiences;
    }
  }

  //Search audience between dates
  async getSearchAudience(searchAudienceDto) {
    // Getting audience by status
    const audiences = await this.audienceModel
      .find({ status_audience: searchAudienceDto.status_audience })
      .sort({ audience_creation: -1 })
      .populate(
        'user',
        '_id nom prenom email cni profile_photo telephone adresse',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate('request', '_id object request_creation type_request')
      .exec();

    // Mapping the audience
    const audienceMapped = mapAudience(audiences);
    // Creating a date const for dto
    const debut = new Date(searchAudienceDto?.date_debut);
    const end = new Date(searchAudienceDto?.date_end);
    // Filtering the audience between dates
    const filteredAudience: any = audienceMapped.filter((item: any) => {
      const audience_date = new Date(item?.date_availability);
      return audience_date >= debut && audience_date <= end;
    });

    return filteredAudience;
  }

  // Getting an audience by id
  async getAudiencebyId(id: string) {
    const audience = await this.audienceModel
      .findById(id)
      .populate(
        'user',
        '_id nom prenom email cni telephone adresse profile_photo',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate(
        'request',
        '_id object type_request request_creation date_wanted_debut date_wanted_end',
      )
      .exec();
    return mapSingleAudience(audience);
  }

  // Getting an audience by ref
  async getAudienceByRef(ref_audience: string) {
    const audience = await this.audienceModel
      .findOne({ ref_audience })
      .populate(
        'user',
        '_id nom prenom email cni telephone adresse profile_photo',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate(
        'request',
        '_id object type_request request_creation date_wanted_debut date_wanted_end',
      )
      .exec();
    return mapSingleAudience(audience);
  }

  //Create audience
  async createAudience(createAudienceDto, usr, req, ava: any) {
    const { request, availability, user } = createAudienceDto;
    // Generating the ref
    const ref_audience: string = generateRandomRef();
    // Request detail for email
    const {
      type_request,
      request_creation,
      user_nom,
      user_prenom,
      user_email,
    } = req;
    const nom = user_nom;
    const prenom = user_prenom;
    const email = user_email;
    const { date_availability, hour_debut, hour_end } = ava;
    // Generate qr code for mailing
    const qrCodeDataToURL = await qrcode.toDataURL(ref_audience);

    const mailBody = setOrganizeAudienceMail(
      nom,
      prenom,
      date_availability,
      hour_debut,
      hour_end,
      type_request,
      request_creation,
      qrCodeDataToURL,
    );

    //Creating the audience
    const response = await this.audienceModel.create({
      ref_audience,
      request,
      availability,
      user,
    });

    // Sending mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Invitation pour une audience',
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

  //Treating audience status
  async treatAudience(id: string, usr, req, ava) {
    // Request detail for email
    const { user_nom, user_prenom, user_email } = req;
    const nom = user_nom;
    const prenom = user_prenom;
    const email = user_email;
    const { date_availability, hour_debut, hour_end } = ava;

    const mailBody = setCancelAudienceMail(
      nom,
      prenom,
      date_availability,
      hour_debut,
      hour_end,
    );

    const audi_status = await this.audienceModel.findById(id).exec();
    if (
      audi_status.status_audience[0] === AudienceStatus.Closed ||
      audi_status.status_audience[0] === AudienceStatus.Missed
    ) {
      throw new UnauthorizedException(
        "L'audience correspondant ne peut plus être annulée !",
      );
    }

    // Updating audience
    const response = await this.audienceModel
      .findByIdAndUpdate(
        id,
        { status_audience: AudienceStatus.Canceled },
        { new: true },
      )
      .exec();
    // Sending mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Audience annulée',
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

  //Count all audience
  async countAllAudience() {
    return await this.audienceModel.countDocuments();
  }

  //Get audience by status
  async getAudienceByStatus(status_audience) {
    return await this.audienceModel.find({ status_audience }).exec();
  }

  //Get audience by availability
  async getAudienceByAvailability(availability) {
    return await this.audienceModel.findOne({ availability }).exec();
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
    const audiences = await this.audienceModel
      .find({ user })
      .populate(
        'user',
        '_id nom prenom email cni telephone adresse profile_photo',
      )
      .populate('availability', '_id date_availability hour_debut hour_end')
      .populate('request', '_id request_creation object type_request')
      .exec();
    return mapAudience(audiences);
  }

  //Count audience by user
  async countAudienceByUser(user) {
    return await this.audienceModel.find({ user }).countDocuments().exec();
  }

  //Delete request by user id
  async deleteManyAudienceByUserId(user: string) {
    await this.audienceModel.deleteMany({ user }).exec();
  }

  //Cancel status by availability id
  async cancelAudience(availability: string) {
    const audi = await this.audienceModel.find({ availability }).exec();
    const id = audi[0]._id;
    await this.audienceModel
      .findByIdAndUpdate(id, { status_audience: AudienceStatus.Canceled })
      .exec();
  }

  //Change status to closed
  async closeAudience(id: string) {
    return await this.audienceModel
      .findByIdAndUpdate(id, { status_audience: AudienceStatus.Closed })
      .exec();
  }

  //Change status to missed
  async missingAudience(id: string) {
    return await this.audienceModel
      .findByIdAndUpdate(id, { status_audience: AudienceStatus.Missed })
      .exec();
  }

  // Report an audience
  async reportAudience(
    id: string,
    reportAudienceDto: ReportAudienceDto,
    req,
    old_ava,
    new_ava,
    audi,
  ) {
    // Request detail for email
    const { user_nom, user_prenom, user_email } = req;
    const nom = user_nom;
    const prenom = user_prenom;
    const email = user_email;
    const old_availability = old_ava.date_availability;
    const old_hour_debut = old_ava.hour_debut;
    const old_hour_end = old_ava.hour_end;
    const new_availability = new_ava.date_availability;
    const new_hour_debut = new_ava.hour_debut;
    const new_hour_end = new_ava.hour_end;
    const ref = audi.ref_audience;
    const qrCodeDataToURL = await qrcode.toDataURL(ref);

    const mailBody = setReportAudienceMail(
      nom,
      prenom,
      old_availability,
      old_hour_debut,
      old_hour_end,
      new_availability,
      new_hour_debut,
      new_hour_end,
      qrCodeDataToURL,
    );

    //Reporting the audience
    const response = await this.audienceModel
      .findByIdAndUpdate(
        id,
        {
          availability: reportAudienceDto?.new_availability,
          status_audience: AudienceStatus.Postponed,
        },
        { new: true },
      )
      .exec();

    // Sending mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Audience reportée',
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

  //Getting audience for chart
  async getAudienceForChart() {
    const total_closed = await this.audienceModel
      .find({ status_audience: AudienceStatus.Closed })
      .countDocuments()
      .exec();
    const total_missed = await this.audienceModel
      .find({ status_audience: AudienceStatus.Missed })
      .countDocuments()
      .exec();
    const total_fixed = await this.audienceModel
      .find({ status_audience: AudienceStatus.Fixed })
      .countDocuments()
      .exec();
    const total_postponed = await this.audienceModel
      .find({ status_audience: AudienceStatus.Postponed })
      .countDocuments()
      .exec();
    const total_canceled = await this.audienceModel
      .find({ status_audience: AudienceStatus.Canceled })
      .countDocuments()
      .exec();

    return {
      total_fixed,
      total_postponed,
      total_canceled,
      total_missed,
      total_closed,
    };
  }
}

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudienceStatus } from 'src/enums/audiencestatus.enum';
import { mapAudience, mapSingleAudience } from 'src/mappers/audience.mapper';
import { Audience } from 'src/schema/audience.schema';
import { formatDate, formatTime } from 'src/utils/dateformatter';
import { generateRandomRef } from 'src/utils/generateRandom';
import * as qrcode from 'qrcode';

@Injectable()
export class AudienceService {
  constructor(
    @InjectModel(Audience.name)
    private audienceModel: Model<Audience>,
    private mailerService: MailerService,
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
      .populate('request','_id object type_request date_wanted_debut date_wanted_end')
      .exec();
    return mapSingleAudience(audience);
  }

  //Create audience
  async createAudience(createAudienceDto,usr, req, ava: any) {
    const {request, availability, user} = createAudienceDto;
    console.log("ito aloha", usr, "de aveo ito", req, "de farany", ava)
    const ref_audience: string = generateRandomRef();
    // Request detail for email
    const { type_request, request_creation, user_nom, user_prenom, user_email } = req;
    const nom = user_nom;
    const prenom = user_prenom;
    const email = user_email;
    const { date_availability, hour_debut, hour_end } = ava;
    const qrCodeDataToURL = await qrcode.toDataURL(ref_audience);

    const mailBody = `
      <html lang="en">
  <head>
      <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      </head>
      <body style="background: #f1f1f1">
        <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" >
          <tbody> 
           <tr> 
            <td align="left"> 
              <!---Header--->
              <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
                <tbody><tr>
                  <td style="background: green">
                    <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: grey; padding: 10px 40px;">
                      <tbody> 
                      <tr> 
                        <td align="left"> 
                        <table style="border:none;border-collapse:collapse;display:inline-table;float:right" valign="top"  cellspacing="0" cellpadding="0" border="0" align="right"> 
                          <tbody> 
                            <tr> 
                            <td valign="middle" align="left"> 
                              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody> 
                                <tr> 
                                <td valign="middle" height="54" align="center">
                                  <td valign="middle" height="54" align="center">
                                    <div style="font-size: 25px;color: white;font-weight: bold; text-align: right;">
                                      <div style="font-size: 18px;  margin: 10px 0;">
                                        Ministère de l'Interieur
                                      </div>
                                      <div style="font-size: 22px;">
                                        MININTER: Audience
                                      </div>
                                    </div>
                                  </td> 
                                </td> 
                                </tr> 
                              </tbody>
                              </table>
                            </td> 
                            </tr> 
                          </tbody>  
                    </table>
                  <table style="border:none;border-collapse:collapse;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="left"> 
                    <tbody> 
                    <tr> 
                      <td valign="middle" align="left"> 
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tbody> 
                        <tr> 
                          <img src="./mid-logo.jpg" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
                        </tr> 
                        </tbody>
                      </table>
                      </td> 
                    </tr> 
                    </tbody> 
                  </table> 
                  </td> 
                </tr> 
                </tbody> 
              </table> 
              </td> 
            </tr> 
            </tbody> 
          </table>
          </td>
        </tr>
        <tr>
          <td>
            <!---Body--->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
              <tbody><tr>
                <td style="background:white; color: black;text-align:center">
                  <div style="padding: 40px;background: white;text-align: center;">
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Invitation pour une audience</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Le ministère de l'interieur a le plaisir de vous compter comme ivité à l'occasion d'une audience avec le ministre le ${date_availability} de ${hour_debut} à ${hour_end} .<br>
                      Cette audience est organisé par votre demande soumise le ${request_creation} pour ${type_request} .<br>
                      Ci-joint votre QR code, votre ticket d'entrée. N'oubliez pas votre carte d'identité.
                      <div>
                        <img  src=${qrCodeDataToURL} alt="QR Code" style="width: 250px; height: 250ox; object-fit: cover; margin: 0 auto;" />
                      </div>
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que une audience avec le ministre a été organisé sur le site d'audience du ministère de l'interieur.
                  </div>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
        <tr>
          <td>
            <!--Footer--->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
              <tbody><tr>
                <td style="background: green">
                  <table role="Presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: grey; padding: 40px;">
                    <tbody> 
                    <tr> 
                      <td align="left"> 
                      <table style="border:none;border-collapse:collapse;display:inline-table;float:right" valign="top"  cellspacing="0" cellpadding="0" border="0" align="right"> 
                        <tbody> 
                          <tr> 
                          <td valign="middle" align="left"> 
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tbody> 
                              <tr> 
                              <td valign="middle" height="54" align="center">
                                <img src="./mid-logo.jpg" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
                              </td> 
                              </tr> 
                            </tbody>
                            </table>
                          </td> 
                          </tr> 
                        </tbody>  
                  </table>
                <table style="border:none;border-collapse:collapse;display:inline-table;" cellspacing="0" cellpadding="0" border="0" align="left"> 
                  <tbody> 
                  <tr> 
                    <td valign="middle" align="left"> 
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody> 
                      <tr> 
                        <td valign="middle" height="54" align="center">
                          <div style="font-size: 25px;color: white;font-weight: bold; text-align: left;">
                            <div style="font-size: 16px;">
                              Ministère de l'Interieur
                            </div>
                            <div style="font-size: 20px; margin: 10px 0;">
                              MININTER: Audience
                            </div>
                            <div style="font-size: 12px;">
                              @copyright 2024
                            </div>
                          </div>
                        </td> 
                      </tr> 
                      </tbody>
                    </table>
                    </td> 
                  </tr> 
                  </tbody> 
                </table> 
                </td> 
              </tr> 
              </tbody> 
            </table>  
          </td>
        </tr>
      </tbody></table>
    </body>
    </html>

  `;

  await this.mailerService.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "MININTER/AUDIENCE: Inscription réussie",
    html: mailBody,
    attachDataUrls: true,
    attachments: [{
      filename: 'mid-logo.jpg',
      path: '../mid-backend/src/assets/mid-logo.jpg',
      cid: 'mid'
    }]
  })
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
    const audiences = await this.audienceModel.find({ user })
      .populate('user', '_id nom prenom email cni telephone adresse profile_photo')
      .populate('availability','_id date_availability hour_debut hour_end')
      .populate('request','_id object type_request')
      .exec();
    return mapAudience(audiences);
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

  async reportAudience(id: string, availability: any) {
    return await this.audienceModel.findByIdAndUpdate(id, availability).exec();
  }
}

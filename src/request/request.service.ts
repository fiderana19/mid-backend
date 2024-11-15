import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestStatus } from 'src/enums/requeststatuts.enum';
import { mapRequest, mapSingleRequest } from 'src/mappers/request.mapper';
import { Request } from 'src/schema/request.schema';
import { User } from 'src/schema/user.schema';
import { formatDate } from 'src/utils/dateformatter';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<Request>,
    private mailerService: MailerService,
  ) {}

  //Get all request
  async getRequest(): Promise<any> {
    const req = await this.requestModel
      .find()
      .populate(
        'user',
        '_id nom prenom cni adresse email telephone profile_photo',
      )
      .exec();

    return mapRequest(req);
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
                          <img src="cid:mid" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
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
                <td style="color: black;text-align:center; background: white;">
                  <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Demande d'audience aprouvée !</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre demande d'audience soumise le ${creation} de type ${type_request} pour la semaine de ${debut} à ${end} a été approuvé.<br>
                      Vous reçevrez plus tard un email pour la date et l'heure de votre audience.
                  </div>
                </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que votre demande d'audience a été approuvée sur le site d'audience du ministère de l'interieur.
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
                                <img src="cid:mid" alt="Mininter Logo" style="width: 70px;height: 70px;object-fit: cover;" />
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
    // Accepting request
    const response = await this.requestModel
      .findByIdAndUpdate(id, treatRequestDto, { new: true })
      .exec();

    // Sending mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Inscription réussie',
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
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Demande d'audience réfusée !</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre demande d'audience soumise le ${creation} de type ${type_request} pour la semaine de ${debut} à ${end} a été réfusée.<br>
                      La disponibilité du ministre pour ce semaine est chargée.
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que votre demande d'audience a été réfusée sur le site d'audience du ministère de l'interieur.
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
    // Denying request
    const response = await this.requestModel
      .findByIdAndUpdate(id, treatRequestDto, { new: true })
      .exec();
    // Seding mail
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MININTER/AUDIENCE: Inscription réussie',
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
}

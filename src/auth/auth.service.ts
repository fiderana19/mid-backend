import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { mapSingleUser, mapUser } from 'src/mappers/user.mapper';
import { UpdateUserPassword } from 'src/dto/update-user-paswword.dto';
import { UpdateUserPasswordForFirstLogin } from 'src/dto/update-user-password-first-login.dto';
import { RequestService } from 'src/request/request.service';
import { AudienceService } from 'src/audience/audience.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as qrcode from 'qrcode';
import { generateRandom6digits } from 'src/utils/generateRandom';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private requestService: RequestService,
    private audienceService: AudienceService,
    private mailerService: MailerService,
  ) {}

  //Get all user
  async getAuth(): Promise<any> {
    const users = await this.userModel.find({ roles: 'user' }).exec();
    return mapUser(users);
  }

  //Signup
  async signUp(signUpDto, profile_photo, cni_photo): Promise<any> {
    // Converting images to base64
    const profile_photob64 = profile_photo[0].buffer.toString('base64');
    const cni_photob64 = cni_photo[0].buffer.toString('base64');

    const {
      nom,
      prenom,
      email,
      adresse,
      telephone,
      date_naissance,
      lieu_naissance,
      cni,
      date_cni,
      lieu_cni,
    } = signUpDto;

    // Converting nom to uppercase
    const nom2uppercase = nom.toUpperCase();
    //Generating random password
    const randomPassword = generateRandom6digits();
    // Hashing the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const hashedReal = hashedPassword.toString();
    // Creating the user
    await this.userModel.create({
      nom: nom2uppercase,
      prenom,
      email,
      telephone,
      adresse,
      date_naissance,
      lieu_naissance,
      cni,
      date_cni,
      lieu_cni,
      profile_photo: profile_photob64,
      cni_photo: cni_photob64,
      password: hashedReal,
    });

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
          <tr>
          <td>
            <!---Body--->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto!important;table-layout:fixed!important">
              <tbody><tr>
                <td style="background:white; color: black;text-align:center">
                <div>
                  <div style="padding: 40px;background: white;text-align: center;">
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Inscription réussie !</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre inscription a été bien réussie sur le plateforme d'audience du ministère de l'interieur.
                      Votre compte est toujours en attente de validation par l'administrateur.<br>
                      Utiliser le code ci-dessous comme mot de passe initial pour vous connecter : 
                      <div style="max-width: max-content;font-size: 27px; font-weight: bold;margin: 15px auto; border-radius: 5px; padding: 15px; border-style: solid; border-width: thin; border-color: gray;">${randomPassword}</div>
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);padding: 40px;>
                    Vous avez reçu cet email parce que vous avez inscit sur le site d'audience du ministère de l'interieur.
                  </div>
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
    // Sending email
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

    return {
      message: 'Les informations sont envoyés avec succés',
      initialPwd: randomPassword,
    };
  }

  //Login
  async login(loginDto): Promise<any> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    //If the user didn't exist
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    //Testing the user validation
    if (!user.validation) {
      throw new UnauthorizedException(
        "Votre compte n'est pas encore validé par l'administrateur",
      );
    }

    //Matching the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const acces_token = await this.jwtService.sign({
      id: user._id,
      role: user.roles,
    });

    return { token: acces_token, is_not_first_login: user.is_not_first_login };
  }

  //Validate user
  async validateUser(id: string) {
    const user = await this.userModel.findById(id);
    const { email, nom, prenom } = user;
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
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Compte validé !</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre compte a été validé par l'administrateur.<br>
                      Vous pouvez maintenant vous connecter en utilisant votre mot de passe initial.
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que votre compte a été validé par l'administrateur sur le site d'audience du ministère de l'interieur.
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

    // Validating the user
    const response = await this.userModel
      .findByIdAndUpdate(id, { validation: true })
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

  //Get User by id
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return mapSingleUser(user);
  }

  //Get User by id for mailing
  async getUserByIdForMailing(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  //Check the user
  async checkUser(email: string) {
    const user = await this.userModel.find({ email }).exec();
    if (user.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  //Get user by validation
  async getUserByValidation(validation: boolean) {
    const users = await this.userModel.find({ validation }).exec();
    return mapUser(users);
  }

  //Count user by validation
  async countUserByValidation(validation: boolean) {
    return await this.userModel.find({ validation }).countDocuments().exec();
  }

  //Update user
  async updateUser(id: string, updateUser: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, updateUser, { new: true })
      .exec();
  }

  //Update user password for first login
  async initializePassword(
    id: string,
    updateUser: UpdateUserPasswordForFirstLogin,
  ) {
    const { password } = updateUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userModel
      .findByIdAndUpdate(
        id,
        { password: hashedPassword, is_not_first_login: true },
        { new: true },
      )
      .exec();
  }

  //Update user password
  async updateUserPassword(id: string, updateUser: UpdateUserPassword) {
    const { old_password, new_password } = updateUser;
    const user = await this.userModel.findById(id);

    //Matching the password
    const isPasswordMatched = await bcrypt.compare(old_password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Mot de passe incorrect !');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    return await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }

  //Delete user
  async deleteUser(id: string) {
    await this.requestService.deleteManyRequestByUserId(id);
    await this.audienceService.deleteManyAudienceByUserId(id);

    const user = await this.userModel.findById(id);
    const { email, nom, prenom } = user;
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
                    <div style="font-size: 25px; font-weight: bold;margin-bottom: 15px;">Compte supprimé !</div>
                    <div style="font-size: 15px;margin-bottom: 15px; color: rgba(0,0,0,0.7);">
                      Bonjour ${nom} ${prenom}.<br > 
                      Votre compte sur le site d'audience du ministère de l'interieur a été supprimé par l'administrateur pour des raisons explicites.<br>
                      Vous pouvez vous réinscrire à nouveau sur le site.
                    </div>
                  </div>
                  <div style="height: 1px; background: gray;"></div>
                  <div style="padding: 40px;background: white;text-align: center; font-size: 12px; color: rgba(0,0,0,0.7);">
                    Vous avez reçu cet email parce que votre compte a été supprimé sur le site d'audience du ministère de l'interieur.
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
    // Deleting the user
    const response = await this.userModel.findByIdAndDelete(id).exec();
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

  async countUserStat() {
    const total_user = await this.userModel
      .find({ roles: 'user' })
      .countDocuments()
      .exec();
    const total_user_valid = await this.userModel
      .find({ roles: 'user', validation: false })
      .countDocuments()
      .exec();
    const total_user_notvalid = await this.userModel
      .find({ roles: 'user', validation: true })
      .countDocuments()
      .exec();

    return { total_user, total_user_valid, total_user_notvalid };
  }
}

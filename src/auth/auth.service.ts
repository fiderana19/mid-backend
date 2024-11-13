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
import { promisify } from 'util';
import * as fs from 'fs';
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

  private readFileAsync = promisify(fs.readFile);


  //Get all user
  async getAuth(): Promise<any> {
    const users = await this.userModel.find({ roles: "user" }).exec();
    return mapUser(users);
  }

  //Signup
  async signUp(signUpDto, profile_photo, cni_photo): Promise<any> {
    // console.log('1 image : ', profile_photo , '2 image : ', cni_photo);
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

    const randomPassword = generateRandom6digits();

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const hashedReal = hashedPassword.toString();

    await this.userModel.create({
      nom,
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

    const qrCodeDataToURL = await qrcode.toDataURL('Messi');

    const mailBody = `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>

        <style text="text/css">
          .my { color: blue }
          p { color: blue }
        </style>

      </head>
      <body>
          <div> 
            <img src="cid:mid" alt="Mininter Logo" width=200 height=200 />
            <img src=${qrCodeDataToURL} alt="Mininter Logo" />
            <div class="my">
              Bonjour ${nom} ${prenom}. Votre mot de passe initial est: ${randomPassword}
            </div>
          </div>
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

    return { message: 'Les informations sont envoyés avec succés', initialPwd: randomPassword };
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
    return await this.userModel.findByIdAndUpdate(id, { validation: true }).exec();
  }

  //Get User by id
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return mapSingleUser(user);
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
  async initializePassword(id: string, updateUser: UpdateUserPasswordForFirstLogin) {
    const { password } = updateUser;
    const hashedPassword = await bcrypt.hash(password,10);

    return await this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword, is_not_first_login: true }, { new: true })
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
    
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async countUserStat() {
    const total_user = await this.userModel.find({ roles : "user" }).countDocuments().exec();
    const total_user_valid = await this.userModel.find({ roles : "user", validation : false }).countDocuments().exec();
    const total_user_notvalid = await this.userModel.find({ roles : "user", validation : true }).countDocuments().exec();
    
    return { total_user, total_user_valid, total_user_notvalid };
  }
}

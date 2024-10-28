import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ValidateUserDto } from 'src/dto/validate-user.dto';
import { mapUser, formatDate } from 'src/mappers/user.mapper';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    //Get all user
    async getAuth(): Promise<any> {
        const users = await this.userModel.find().exec();
        return mapUser(users);
    }

    //Signup
    async signUp(signUpDto): Promise<any> {
        const { nom, prenom, email, telephone, date_naissance, lieu_naissance, cni, date_cni, lieu_cni, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password,10);

        await this.userModel.create({
            nom, 
            prenom, 
            email, 
            telephone, 
            date_naissance, 
            lieu_naissance, 
            cni, 
            date_cni, 
            lieu_cni, 
            password: hashedPassword
        })

        return { message: "Les informations sont envoyés avec succés" };
    }

    //Login
    async login(loginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        //If the user didn't exist
        if(!user) {
            throw new UnauthorizedException('Invalid email');
        }

        //Testing the user validation
        if(!user.validation) {
            throw new UnauthorizedException("Votre compte n'est pas encore validé par l'administrateur");
        }

        //Matching the password
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = await this.jwtService.sign({ id: user._id, role: user.roles })

        return { token };
    }

    //Validate user
    async validateUser(id: string, validateUserDto: ValidateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, validateUserDto).exec();
    }

    //Get User by id
    async getUserById(id: string) {
        const user =  await this.userModel.findById(id).exec();
        return {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            date_naissance: formatDate(user.date_naissance),
            lieu_naissance: user.lieu_naissance,
            cni: user.cni,
            date_cni: formatDate(user.date_cni),
            lieu_cni: user.lieu_cni,
            user_creation: formatDate(user.user_creation),
            validation: user.validation,
        }
        // return mapUser(users);
    }

    //Check the user
    async checkUser(email: string) {
        const user = await this.userModel.find({ email }).exec();
        if(user.length > 0) {
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
        return await this.userModel.findByIdAndUpdate(id, updateUser, { new: true }).exec();
    }

    //Delete user
    async deleteUser(id:string) {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}
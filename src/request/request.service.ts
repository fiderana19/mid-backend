import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TreatRequestDto } from 'src/dto/treat-request.dto';
import { RequestStatus } from 'src/enums/requeststatuts.enum';
import { Request } from 'src/schema/request.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private requestModel: Model<Request>,
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {}

    //Get all request
    async getRequest(): Promise<any> {        
        const req = await this.requestModel.find().populate('user', 'nom prenom cni').exec();

        return req.map((request) => ({
            user_nom: request.user ? request.user.nom : '',
            user_prenom: request.user ? request.user.prenom : '',
            user_cni: request.user ? request.user.cni : '',
            date_request: request.date_request,
            type_request: request.type_request,
            object: request.object,
            date_wanted_debut: request.date_wanted_debut,
            date_wanted_end: request.date_wanted_end,
            status_request: request.status_request,
        }));
    }

    //Create request
    async createRequest(createRequestDto, user: User) {
        const data = Object.assign(createRequestDto, { user: user._id })

        return await this.requestModel.create(data);
    }

    //Get request by user
    async getRequestByUser(user: string) {
        return await this.requestModel.find({ user }).exec();
    }

    //Count request by user
    async countRequestByUser(user: string) {
        return await this.requestModel.find({ user }).countDocuments().exec();
    }

    //Treat request
    async treatRequest(id: string, treatRequestDto) {
        return await this.requestModel.findByIdAndUpdate(id, treatRequestDto, { new: true }).exec(); 
    }

    //Update request
    async updateRequest(id: string, updateRequestDto) {
        const requete = await this.requestModel.findById(id);

        if(requete.status_request == RequestStatus.Accepted) {
            throw new UnauthorizedException("Ce demande est déjà approuvée");
        }

        return await this.requestModel.findByIdAndUpdate(id, updateRequestDto, { new: true }).exec();
    }

    //Delete request
    async deleteRequest(id: string) {
        const requete = await this.requestModel.findById(id);

        if(requete.status_request == RequestStatus.Accepted) {
            throw new UnauthorizedException("Ce demande est déjà approuvée");
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
        return await this.requestModel.find({ status_request }).countDocuments().exec();
    }
}

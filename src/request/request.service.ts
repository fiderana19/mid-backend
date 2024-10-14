import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    async getRequest(): Promise<any> {        
        const req = await this.requestModel.find().populate('user', 'nom').exec();

        return req.map((request) => ({
            user: request.user ? request.user.nom : '',
            motif: request.motif,
        }));
    }

    async createRequest(createRequestDto, user: User) {
        const data = Object.assign(createRequestDto, { user: user._id })

        return await this.requestModel.create(data);
    }
}

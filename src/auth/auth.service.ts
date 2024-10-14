import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async getAuth(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async signUp(signUpDto): Promise<{ token: string }> {
        const { nom, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await this.userModel.create({
            nom,
            email,
            password: hashedPassword
        })

        const token = await this.jwtService.sign({ id: user._id })

        return { token };
    }

    async login(loginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        if(!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = await this.jwtService.sign({ id: user._id })

        return { token };
    }

    async updateUser(id: string, updateUser: UpdateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, updateUser, { new: true }).exec();
    }

    async deleteUser(id:string) {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}

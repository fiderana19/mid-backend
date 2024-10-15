import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document } from "mongoose";
import { Role } from "src/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
    @Prop({ required: true })
    nom: string;

    @Prop({ required: false })
    prenom: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    telephone: string;

    @Prop({ required: true })
    date_naissance: Date;

    @Prop({ required: true })
    lieu_naissance: string;

    @Prop({ required: true })
    cni: string;

    @Prop({ required: true })
    date_cni: Date;

    @Prop({ required: true })
    lieu_cni: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    validation: boolean;

    @Prop({ 
        type: [{ type: String, enum: Role }], 
        default: [Role.ADMIN] 
    })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
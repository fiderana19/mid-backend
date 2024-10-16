import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document } from "mongoose";
import { Role } from "src/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
    @Prop()
    nom: string;

    @Prop()
    prenom?: string;

    @Prop()
    email: string;

    @Prop()
    telephone?: string;

    @Prop()
    date_naissance?: Date;

    @Prop()
    lieu_naissance?: string;

    @Prop()
    cni?: string;

    @Prop()
    date_cni?: Date;

    @Prop()
    lieu_cni?: string;

    @Prop()
    password: string;

    @Prop({ default: false })
    validation?: boolean;

    @Prop({ 
        type: [{ type: String, enum: Role }], 
        default: [Role.ADMIN] 
    })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
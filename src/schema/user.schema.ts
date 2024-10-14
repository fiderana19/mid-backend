import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document } from "mongoose";
import { Role } from "src/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
    @Prop({ required: true })
    nom: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ 
        type: [{ type: String, enum: Role }], 
        default: [Role.ADMIN] 
    })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Request } from "./request.schema";
import { Availability } from "./availability.schema";
import { User } from "./user.schema";
import { AudienceStatus } from "src/enums/audiencestatus.enum";

export type AudienceDocument = HydratedDocument<Audience>;

@Schema()
export class Audience extends Document {
    @Prop({ required: true })
    date_audience: Date;

    @Prop({ 
        type: [{ type: String, enum: AudienceStatus }],
        default: [AudienceStatus.Fixed]
    })
    status_audience: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Request' })
    request: Request;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' })
    availability: Availability;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const AudienceSchema = SchemaFactory.createForClass(Audience);
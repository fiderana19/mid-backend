import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document, now } from "mongoose";
import { User } from "./user.schema";
import { RequestType } from "src/enums/requesttype.enum";
import { RequestStatus } from "src/enums/requeststatuts.enum";

export type RequestDocument = HydratedDocument<Request>;

@Schema({ timestamps: true }) 
export class Request extends Document {
    @Prop({ 
        type: [{ type: String, enum: RequestType }],
        default: [RequestType.Information]
     })
    type_request: RequestType;

    @Prop()
    object: string;

    @Prop()
    date_wanted_debut: Date;

    @Prop()
    date_wanted_end: Date;

    @Prop({ default: now() })
    request_creation: Date;

    @Prop({ 
        type: [{ type: String, enum: RequestStatus }],
        default: [RequestStatus.Waiting]
     })
    status_request: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document } from "mongoose";
import { User } from "./user.schema";

export type RequestDocument = HydratedDocument<Request>;

@Schema() 
export class Request extends Document {
    @Prop({ required: true })
    motif: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from 'mongoose';

export type AvailabilityDocument = HydratedDocument<Availability>;

@Schema({ timestamps: true })
export class Availability extends Document {
    @Prop({ required: true })
    hour_debut: Date;

    @Prop({ required: true })
    hour_end: Date;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
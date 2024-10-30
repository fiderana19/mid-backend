import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { AvailabilityStatus } from '../enums/availability.enum';

export type AvailabilityDocument = HydratedDocument<Availability>;

@Schema({ timestamps: true })
export class Availability extends Document {
  @Prop()
  date_availability: Date;

  @Prop()
  hour_debut: Date;

  @Prop()
  hour_end: Date;

  @Prop({
    type: [{ type: String, enum: AvailabilityStatus }],
    default: [AvailabilityStatus.Available],
  })
  status_available: AvailabilityStatus;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

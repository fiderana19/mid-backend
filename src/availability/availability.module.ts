import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schema/availability.schema';
import { AudienceService } from 'src/audience/audience.service';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Audience.name, schema: AudienceSchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService, AudienceService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}

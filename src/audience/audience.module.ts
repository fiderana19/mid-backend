import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';
import { AvailabilityService } from 'src/availability/availability.service';
import { Availability, AvailabilitySchema } from 'src/schema/availability.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Audience.name, schema: AudienceSchema },
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  controllers: [AudienceController],
  providers: [AudienceService, AvailabilityService],
  exports: [AudienceService],
})
export class AudienceModule {}

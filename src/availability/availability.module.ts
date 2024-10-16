import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Availability, AvailabilitySchema } from 'src/schema/availability.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
    ])
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService]
})
export class AvailabilityModule {}

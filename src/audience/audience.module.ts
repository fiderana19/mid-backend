import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schema/availability.schema';
import { Request, RequestSchema } from 'src/schema/request.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Audience.name, schema: AudienceSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AudienceController],
  providers: [AudienceService],
})
export class AudienceModule {}

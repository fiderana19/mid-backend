import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';
import { AvailabilityService } from 'src/availability/availability.service';
import {
  Availability,
  AvailabilitySchema,
} from 'src/schema/availability.schema';
import { MailingModule } from 'src/mailing/mailing.module';
import { User, UserSchema } from 'src/schema/user.schema';
import { Request, RequestSchema } from 'src/schema/request.schema';
import { RequestService } from 'src/request/request.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MailingModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Audience.name, schema: AudienceSchema },
      { name: User.name, schema: UserSchema },
      { name: Request.name, schema: RequestSchema },
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  controllers: [AudienceController],
  providers: [
    AudienceService,
    AvailabilityService,
    RequestService,
    AuthService,
    JwtService,
  ],
  exports: [AudienceService],
})
export class AudienceModule {}

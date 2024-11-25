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
import { Request, RequestSchema } from 'src/schema/request.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { RequestService } from 'src/request/request.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Audience.name, schema: AudienceSchema },
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [
    AudienceService,
    AvailabilityService,
    RequestService,
    AuthService,
    JwtService,
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}

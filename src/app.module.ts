import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AudienceModule } from './audience/audience.module';
import { RequestModule } from './request/request.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AvailabilityModule } from './availability/availability.module';
import { MailingModule } from './mailing/mailing.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000 * 10,
          limit: 10,
        },
      ],
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    AudienceModule,
    AvailabilityModule,
    RequestModule,
    MailingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule {}

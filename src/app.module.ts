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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    AudienceModule,
    RequestModule,
    AvailabilityModule,
    MailingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

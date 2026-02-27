import { Global, Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/schema/request.schema';
import { MailingModule } from 'src/mailing/mailing.module';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';
import { RequestGateway } from './request.gateway';

@Global()
@Module({
  imports: [
    MailingModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: Audience.name, schema: AudienceSchema },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestGateway],
  exports: [RequestService, RequestModule, RequestGateway],
})
export class RequestModule {}

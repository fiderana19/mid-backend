import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Audience.name, schema: AudienceSchema },
    ]),
  ],
  controllers: [AudienceController],
  providers: [AudienceService],
  exports: [AudienceService],
})
export class AudienceModule {}

import { Module } from '@nestjs/common';
import { AudienceController } from './audience.controller';
import { AudienceService } from './audience.service';

@Module({
  controllers: [AudienceController],
  providers: [AudienceService]
})
export class AudienceModule {}

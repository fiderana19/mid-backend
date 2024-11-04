import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/schema/request.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}

import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/schema/request.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [RequestController],
  providers: [RequestService]
})
export class RequestModule {}

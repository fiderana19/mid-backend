import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { Request, RequestSchema } from 'src/schema/request.schema';
import { RequestService } from 'src/request/request.service';
import { AudienceService } from 'src/audience/audience.service';
import { Audience, AudienceSchema } from 'src/schema/audience.schema';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        secure: false,
        port: Number(process.env.EMAIL_PORT),
        tls: {
          ciphers: process.env.EMAIL_TLS_CIPHERS,
        },
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Request.name, schema: RequestSchema },
      { name: Audience.name, schema: AudienceSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RequestService, AudienceService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

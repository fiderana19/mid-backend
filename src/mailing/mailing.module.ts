import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
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
    ],
})
export class MailingModule {}

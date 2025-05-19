import { Inject, Injectable } from '@nestjs/common';
import mailerConfig from './config/mailer.config';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(
    @Inject(mailerConfig.KEY)
    private readonly mailerConfigService: ConfigType<typeof mailerConfig>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.mailerConfigService.GMAIL_APP_USERNAME,
        pass: this.mailerConfigService.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendMail(receiverEmail: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.mailerConfigService.GMAIL_APP_USERNAME,
      to: receiverEmail,
      subject: 'SKY MENU',
    };
    await this.transporter.sendMail({ ...mailOptions });
  }
}

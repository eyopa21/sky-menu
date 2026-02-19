import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from './mailer/mailer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-mail')
  sendMail() {
    return this.mailerService.sendMail('jobtennis21@gmail.com', 'test', 'test');
  }
}

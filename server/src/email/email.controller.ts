import {Body, Controller, Post} from '@nestjs/common';
import {ContactMailDto} from './contact.mail.dto';
import {EmailService} from './email.service';
import {EMAIL_CTRL} from '../provider/routes.helper';

@Controller(EMAIL_CTRL)
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Post('contact')
	async sendContact(@Body() contactBodyDto: ContactMailDto) {
		await this.emailService.sendContactEmail(contactBodyDto);
	}
}

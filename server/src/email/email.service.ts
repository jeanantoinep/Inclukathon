import {Injectable} from '@nestjs/common';
import {MailSender} from '../mail/mail.sender';
import {ContactMailDto} from './contact.mail.dto';
import {InjectModel} from '@nestjs/mongoose';
import {EMAIL_SENT_COLLECTION_NAME} from '../provider/collections.provider';
import {Model} from 'mongoose';
import {EmailDb, EmailDocument} from './sent-email.entity';

@Injectable()
export class EmailService {
	constructor(
		@InjectModel(EMAIL_SENT_COLLECTION_NAME)
		private readonly emailDb: Model<EmailDocument>,
	) {}

	static readonly SEND_CONTACT_MAIL = 'send-contact-mail';

	renderNeeds(contactBodyDto: ContactMailDto) {
		let wantedProjects = 'Projet(s) coché(s): ';
		for (const key in contactBodyDto) {
			if (contactBodyDto[key]) {
				wantedProjects += ' ' + key + ' ';
			}
		}
		return wantedProjects;
	}

	async sendContactEmail(contactBodyDto: ContactMailDto) {
		const subject = '[INCLUKATHON] Demande de prise de contact';
		const text = `
Prise de contact:
${contactBodyDto.firstName} ${contactBodyDto.lastName}, entreprise: ${contactBodyDto.company}
${contactBodyDto.email} ${contactBodyDto.phone}

${contactBodyDto.message}
`;
		const html = `
<h1>Prise de contact:</h1>
<p>${contactBodyDto.firstName} ${contactBodyDto.lastName}, entreprise: ${
			contactBodyDto.company
		}</p>
<p>${contactBodyDto.email} ${contactBodyDto.phone}</p>

<p>${contactBodyDto.message}</p>

<p>${this.renderNeeds(contactBodyDto)}</p>
`;
		const emailSent: EmailDb = await MailSender.sendToCompany(
			subject,
			text,
			html,
		);
		if (!emailSent) {
			return null;
		}
		emailSent.mailType = EmailService.SEND_CONTACT_MAIL;
		const newEmailDb = new this.emailDb(emailSent);
		await newEmailDb.save();
	}
}

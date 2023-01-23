import {EmailDb} from '../email/sent-email.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

export class MailSender {
	static credentials = {
		host: 'smtp-relay.sendinblue.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: '',
			pass: '', // generated ethereal password
		},
	};

	public static readonly inclukathonSender =
		'"" <>';
	public static readonly inclukathonReceiver =
		', ';

	/**
	 * @param subject
	 * @param text email body as text
	 * @param html email body as html string
	 */
	public static async sendToCompany(
		subject: string,
		text: string,
		html: string,
	) {
		try {
			const replacement = /\n/g;
			html = html.replace(replacement, '<br />');
			const emailDb = {
				from: MailSender.inclukathonSender,
				to: MailSender.inclukathonReceiver,
				subject,
				text,
				html,
			} as EmailDb;
			const transporter = nodemailer.createTransport(
				MailSender.credentials,
			);
			await transporter.sendMail(emailDb);
			return emailDb;
		} catch (e) {
			console.error('Error while sending mail', e);
		}
	}
}

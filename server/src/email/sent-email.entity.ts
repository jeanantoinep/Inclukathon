import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {EMAIL_SENT_COLLECTION_NAME} from '../provider/collections.provider';

export type EmailDocument = EmailDb & Document;

@Schema({collection: EMAIL_SENT_COLLECTION_NAME})
export class EmailDb {
	_id?: string;

	@Prop()
	from: string;

	@Prop()
	to: string;

	@Prop()
	subject: string;

	@Prop()
	text: string;

	@Prop()
	html: string;

	@Prop()
	mailType?: string;
}

export const EmailEntity = SchemaFactory.createForClass(EmailDb);

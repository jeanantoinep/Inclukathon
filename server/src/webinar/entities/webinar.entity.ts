import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {COMPANY_COLLECTION_NAME, WEBINAR_COLLECTION_NAME} from '../../provider/collections.provider';
import {DateTime} from 'luxon';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';
import {CompanyDb} from '../../company/entities/company.entity';

export type WebinarDocument = WebinarDb & Document;

@Schema({collection: WEBINAR_COLLECTION_NAME})
export class WebinarDb {
	_id!: string;

	@Prop()
	title: string;
	@Prop()
	'title-en': string;
	@Prop()
	'title-es': string;

	@Prop()
	description: string;
	@Prop()
	'description-en': string;
	@Prop()
	'description-es': string;

	@Prop({default: 1000})
	score: number;

	@Prop()
	path: string;

	@Prop()
	enabled: boolean;

	@Prop()
	startDate: DateTime;

	@Prop()
	endDate: DateTime;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: COMPANY_COLLECTION_NAME,
	})
	@Type(() => CompanyDb)
	company?: CompanyDb | any;
}

export const WebinarEntity = SchemaFactory.createForClass(WebinarDb);

import {WebinarDb, WebinarDocument} from '../entities/webinar.entity';
import {DateTime} from 'luxon';
import {DateTimeHelper} from '../../helper/DateTimeHelper';
import {CompanyDto} from '../../company/dto/company.dto';

export class WebinarDto {
	constructor(webinarDb: WebinarDb) {
		this.id = (webinarDb as WebinarDocument)._id;
		this.title = webinarDb.title;
		this['title-en'] = webinarDb['title-en'];
		this['title-es'] = webinarDb['title-es'];
		this.description = webinarDb.description;
		this['description-en'] = webinarDb['description-en'];
		this['description-es'] = webinarDb['description-es'];
		this.score = webinarDb.score;
		this.path = webinarDb.path;
		this.enabled = webinarDb.enabled;
		this.startDate = DateTimeHelper.toDateTime(webinarDb.startDate);
		this.endDate = DateTimeHelper.toDateTime(webinarDb.endDate);

		// based on other attributes
		const now = DateTime.now();
		this.isInProgress = DateTimeHelper.isIn(now, this.startDate, this.endDate);
		if (this.isInProgress) {
			this.durationUntilEnd = DateTimeHelper.getDurationFormatted(now, this.endDate);
		} else if (DateTimeHelper.isBefore(now, this.startDate)) {
			this.durationUntilStart = DateTimeHelper.getDurationFormatted(now, this.startDate);
		}
		this.formattedStartDate = this.startDate ? DateTimeHelper.formatWithDateOnly(this.startDate) : '';
		this.formattedEndDate = this.endDate ? DateTimeHelper.formatWithDateOnly(this.endDate) : '';

		this.company = webinarDb.company;
		if (this.company && this.company._id) {
			this.company = new CompanyDto(webinarDb.company);
		}
	}

	_id?: string;
	id!: string;
	title: string;
	'title-en': string;
	'title-es': string;
	description: string;
	'description-en': string;
	'description-es': string;
	score: number;
	path: string;
	enabled: boolean;
	startDate: DateTime;
	endDate: DateTime;
	formattedStartDate?: string;
	formattedEndDate?: string;
	isInProgress?: boolean;
	durationUntilEnd?: string;
	durationUntilStart?: string;
	company: CompanyDto;
}

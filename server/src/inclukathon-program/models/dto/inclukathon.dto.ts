import {InclukathonProgramDb, InclukathonProgramDocument} from '../inclukathon-program.entity';
import {BaiDto} from './bai.dto';
import {KthScrAssociationDto} from './kth-scr-association.dto';
import {DeliveriesDto} from './deliveries.dto';
import {DateTime} from 'luxon';
import {DateTimeHelper} from '../../../helper/DateTimeHelper';

export class InclukathonDto {
	constructor(inclukathonDb: InclukathonProgramDb) {
		this.id = (inclukathonDb as InclukathonProgramDocument)._id;
		this.name = inclukathonDb.name;
		this.explanation = inclukathonDb.explanation;
		this.bannerImgPath = inclukathonDb.bannerImgPath;
		this.programImgPath = inclukathonDb.programImgPath;
		this.startDate = DateTimeHelper.toDateTime(inclukathonDb.startDate);
		this.endDate = DateTimeHelper.toDateTime(inclukathonDb.endDate);
		this.subject = inclukathonDb.subject;
		if (inclukathonDb.bai) {
			this.bai = inclukathonDb.bai.map((b) => new BaiDto(b));
		}
		if (inclukathonDb.kthScrAssociation) {
			this.kthScrAssociation = inclukathonDb.kthScrAssociation.map((k) => new KthScrAssociationDto(k));
		}
		if (inclukathonDb.deliveries) {
			this.deliveries = inclukathonDb.deliveries.map((d) => new DeliveriesDto(d));
		}
		this.inProgress = DateTimeHelper.isIn(
			DateTime.now(),
			DateTimeHelper.toDateTime(this.startDate),
			DateTimeHelper.toDateTime(this.endDate),
		);
		this.notStarted = DateTimeHelper.isBefore(DateTime.now(), DateTimeHelper.toDateTime(this.startDate));
	}

	_id?: string; // to update data only
	id: string;
	name: string;
	explanation: string;
	bannerImgPath: string;
	programImgPath: string;
	startDate: DateTime;
	endDate: DateTime;
	subject: string;
	bai: BaiDto[];
	kthScrAssociation: KthScrAssociationDto[];
	deliveries: DeliveriesDto[];

	inProgress?: boolean;
	notStarted?: boolean;
}

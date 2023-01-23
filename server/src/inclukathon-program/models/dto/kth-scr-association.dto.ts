import {KthScrAssociationDb, KthScrAssociationDocument} from '../kth-scr-association.entity';
import {IncluscoreDto} from '../../../incluscore/dto/incluscore.dto';
import {LaunchIncluscoreDto} from '../../../incluscore/dto/launch.incluscore.dto';
import {DateTimeHelper} from '../../../helper/DateTimeHelper';
import {DateTime} from 'luxon';

export class KthScrAssociationDto {
	constructor(kthScrAssociationDb: KthScrAssociationDb) {
		this.id = (kthScrAssociationDb as KthScrAssociationDocument)._id;
		if (kthScrAssociationDb.incluscore) {
			this.incluscore = new IncluscoreDto(kthScrAssociationDb.incluscore);
		}
		if (kthScrAssociationDb.launchIncluscore?._id) {
			this.launchIncluscore = new LaunchIncluscoreDto(kthScrAssociationDb.launchIncluscore);
		}
		this.locked = kthScrAssociationDb.locked;
		this.startDate = DateTimeHelper.toDateTime(kthScrAssociationDb.startDate);
		this.endDate = DateTimeHelper.toDateTime(kthScrAssociationDb.endDate);

		// based on other attributes
		const now = DateTime.now();
		this.isInProgress = DateTimeHelper.isIn(now, this.startDate, this.endDate);
		if (this.isInProgress) {
			this.durationUntilEnd = DateTimeHelper.getDurationFormatted(now, this.endDate);
		} else if (DateTimeHelper.isBefore(now, this.startDate)) {
			this.durationUntilStart = DateTimeHelper.getDurationFormatted(now, this.startDate);
		}
	}

	_id?: string; // to update data only
	id: string;
	incluscore: IncluscoreDto | any;
	launchIncluscore?: LaunchIncluscoreDto | any;
	locked: boolean;
	startDate: DateTime;
	endDate: DateTime;

	// date calculation dto
	isInProgress?: boolean;
	durationUntilEnd?: string;
	durationUntilStart?: string;
}

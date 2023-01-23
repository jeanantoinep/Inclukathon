import {DeliveriesDb, DeliveriesDocument} from '../deliveries.entity';
import {NotationDeliveryDto} from './notation-delivery.dto';
import {DateTime} from 'luxon';
import {DateTimeHelper} from '../../../helper/DateTimeHelper';

export class DeliveriesDto {
	constructor(deliveriesDb: DeliveriesDb) {
		this.id = (deliveriesDb as DeliveriesDocument)._id;
		this.explanation = deliveriesDb.explanation;
		this.locked = deliveriesDb.locked;
		this.startDate = DateTimeHelper.toDateTime(deliveriesDb.startDate);
		this.endDate = DateTimeHelper.toDateTime(deliveriesDb.endDate);
		if (deliveriesDb.notation?.length > 0 && deliveriesDb.notation[0]._id) {
			this.notation = deliveriesDb.notation.map((n) => new NotationDeliveryDto(n));
		}
		this.isAfter = DateTimeHelper.isAfter(DateTime.now(), this.endDate);

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
	explanation: string;
	locked: boolean;
	startDate: DateTime;
	endDate: DateTime;
	notation: NotationDeliveryDto[];

	isInProgress?: boolean;
	isAfter?: boolean;
	durationUntilEnd?: string;
	durationUntilStart?: string;
}

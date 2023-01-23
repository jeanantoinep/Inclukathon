import {DeliveriesDto} from './deliveries.dto';
import {TeamDeliveryDb, TeamDeliveryDocument} from '../team-delivery.entity';
import {NotationDeliveryDto} from './notation-delivery.dto';

export class TeamDeliveryDto {
	constructor(teamDeliveryDb: TeamDeliveryDb) {
		this.id = (teamDeliveryDb as TeamDeliveryDocument)._id;
		if (teamDeliveryDb.delivery?._id) {
			this.delivery = new DeliveriesDto(teamDeliveryDb.delivery);
		}
		this.filesPath = teamDeliveryDb.filesPath;
		this.lastUpdateUnixTime = teamDeliveryDb.lastUpdateUnixTime;
		this.lastUploaderUserId = teamDeliveryDb.lastUploaderUserId;
		if (
			teamDeliveryDb.notation?.length > 0 &&
			teamDeliveryDb.notation[0]?._id
		) {
			this.notation = teamDeliveryDb.notation.map(
				(n) => new NotationDeliveryDto(n),
			);
		}
	}

	_id?: string; // to update data only
	id: string;
	delivery: DeliveriesDto | any;
	filesPath: string[];
	lastUpdateUnixTime: number;
	lastUploaderUserId: string;
	notation: NotationDeliveryDto[];
}

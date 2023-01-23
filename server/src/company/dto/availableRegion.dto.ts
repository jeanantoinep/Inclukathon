import {AvailableRegionDb, AvailableRegionDocument} from '../entities/availableRegion.entity';

export class AvailableRegionDto {
	constructor(db: AvailableRegionDb) {
		this.id = (db as AvailableRegionDocument)._id;
		this.name = db.name;
	}
	id!: string;
	name: string;
}

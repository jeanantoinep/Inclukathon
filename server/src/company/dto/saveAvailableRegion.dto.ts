import {PartialType} from '@nestjs/mapped-types';
import {AvailableRegionDb} from '../entities/availableRegion.entity';

export class SaveAvailableRegionDto extends PartialType(AvailableRegionDb) {
	id?: string;
	companyId: string;
}

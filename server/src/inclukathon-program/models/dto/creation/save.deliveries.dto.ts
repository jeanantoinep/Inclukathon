import {PartialType} from '@nestjs/mapped-types';
import {DeliveriesDto} from '../deliveries.dto';

export class SaveDeliveriesDto extends PartialType(DeliveriesDto) {
	id?: string;
	idKth?: string;
}

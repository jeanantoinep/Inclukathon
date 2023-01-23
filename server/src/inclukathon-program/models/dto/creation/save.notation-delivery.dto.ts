import {PartialType} from '@nestjs/mapped-types';
import {NotationDeliveryDto} from '../notation-delivery.dto';

export class SaveNotationDeliveryDto extends PartialType(NotationDeliveryDto) {
	id?: string;
	idKth?: string;
	idDelivery?: string;
	idTeam?: string;
	idNotationEvaluated?: string;
}

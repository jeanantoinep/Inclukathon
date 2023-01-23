import {
	NotationDeliveryDb,
	NotationDeliveryDocument,
} from '../notation-delivery.entity';

export class NotationDeliveryDto {
	constructor(notationDeliveryDb: NotationDeliveryDb) {
		this.id = (notationDeliveryDb as NotationDeliveryDocument)._id;
		this.question = notationDeliveryDb.question;
		this.values = notationDeliveryDb.values;
		this.selectedValue = notationDeliveryDb.selectedValue;
		this.idNotationEvaluated = notationDeliveryDb.idNotationEvaluated;
	}

	_id?: string; // to update data only
	id: string;
	question: string;
	values: string[];
	selectedValue: string;
	idNotationEvaluated?: string;
}

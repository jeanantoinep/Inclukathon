import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {NOTATION_DELIVERY_COLLECTION_NAME} from '../../provider/collections.provider';

export type NotationDeliveryDocument = NotationDeliveryDb & Document;

@Schema({collection: NOTATION_DELIVERY_COLLECTION_NAME})
export class NotationDeliveryDb {
	_id?: string;

	@Prop()
	question: string;

	@Prop()
	values: string[];

	@Prop()
	selectedValue: string;

	@Prop()
	idNotationEvaluated?: string;
}

export const NotationDeliveryEntity =
	SchemaFactory.createForClass(NotationDeliveryDb);

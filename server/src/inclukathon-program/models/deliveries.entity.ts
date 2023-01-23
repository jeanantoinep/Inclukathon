import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {DELIVERIES_COLLECTION_NAME, NOTATION_DELIVERY_COLLECTION_NAME} from '../../provider/collections.provider';
import {NotationDeliveryDb} from './notation-delivery.entity';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';
import {DateTime} from 'luxon';

export type DeliveriesDocument = DeliveriesDb & Document;

@Schema({collection: DELIVERIES_COLLECTION_NAME})
export class DeliveriesDb {
	_id!: string;

	@Prop()
	explanation: string;

	@Prop()
	locked: boolean;

	@Prop()
	startDate: DateTime;

	@Prop()
	endDate: DateTime;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: NOTATION_DELIVERY_COLLECTION_NAME,
			},
		],
	})
	@Type(() => NotationDeliveryDb)
	notation: NotationDeliveryDb[];
}

export const DeliveriesEntity = SchemaFactory.createForClass(DeliveriesDb);

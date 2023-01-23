import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {
	DELIVERIES_COLLECTION_NAME,
	NOTATION_DELIVERY_COLLECTION_NAME,
	TEAM_DELIVERY_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Type} from 'class-transformer';
import {DeliveriesDb} from './deliveries.entity';
import * as mongoose from 'mongoose';
import {NotationDeliveryDb} from './notation-delivery.entity';

export type TeamDeliveryDocument = TeamDeliveryDb & Document;

@Schema({collection: TEAM_DELIVERY_COLLECTION_NAME})
export class TeamDeliveryDb {
	_id!: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: DELIVERIES_COLLECTION_NAME,
	})
	@Type(() => DeliveriesDb)
	delivery: DeliveriesDb;

	@Prop()
	filesPath: string[];

	@Prop()
	lastUpdateUnixTime: number;

	@Prop()
	lastUploaderUserId: string;

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

export const TeamDeliveryEntity = SchemaFactory.createForClass(TeamDeliveryDb);

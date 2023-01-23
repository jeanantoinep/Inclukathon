import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

import {AVAILABLE_REGION_COLLECTION_NAME} from '../../provider/collections.provider';

export type AvailableRegionDocument = AvailableRegionDb & Document;

@Schema({collection: AVAILABLE_REGION_COLLECTION_NAME})
export class AvailableRegionDb {
	_id!: string;

	@Prop()
	name: string;
}

export const AvailableRegionEntity = SchemaFactory.createForClass(AvailableRegionDb);

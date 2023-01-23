import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BAI_COLLECTION_NAME} from '../../provider/collections.provider';

export type BaiDocument = BaiDb & Document;

@Schema({collection: BAI_COLLECTION_NAME})
export class BaiDb {
	_id!: string;

	@Prop()
	rubrique: string;

	@Prop()
	name: string;

	@Prop()
	imgCoverPath: string;

	@Prop()
	filesPath: string[];
}

export const BaiEntity = SchemaFactory.createForClass(BaiDb);

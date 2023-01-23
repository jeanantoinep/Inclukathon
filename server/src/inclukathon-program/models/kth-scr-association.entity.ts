import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {
	INCLUSCORE_COLLECTION_NAME,
	KTH_SCR_ASSOCIATION_COLLECTION_NAME,
	LAUNCH_SCR_COLLECTION,
} from '../../provider/collections.provider';
import {IncluscoreDb} from '../../incluscore/entities/incluscore.entity';
import {Type} from 'class-transformer';
import * as mongoose from 'mongoose';
import {LaunchIncluscoreDb} from '../../incluscore/entities/launch.incluscore.entity';
import {DateTime} from 'luxon';

export type KthScrAssociationDocument = KthScrAssociationDb & Document;

@Schema({collection: KTH_SCR_ASSOCIATION_COLLECTION_NAME})
export class KthScrAssociationDb {
	_id!: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: INCLUSCORE_COLLECTION_NAME,
	})
	@Type(() => IncluscoreDb)
	incluscore: IncluscoreDb;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: LAUNCH_SCR_COLLECTION,
	})
	@Type(() => LaunchIncluscoreDb)
	launchIncluscore: LaunchIncluscoreDb;

	@Prop()
	locked: boolean;

	@Prop()
	startDate: DateTime;

	@Prop()
	endDate: DateTime;
}

export const KthScrAssociationEntity = SchemaFactory.createForClass(KthScrAssociationDb);

import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	BAI_COLLECTION_NAME,
	DELIVERIES_COLLECTION_NAME,
	INCLUKATHON_PROGRAM_COLLECTION_NAME,
	KTH_SCR_ASSOCIATION_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Type} from 'class-transformer';
import * as mongoose from 'mongoose';
import {BaiDb} from './bai.entity';
import {KthScrAssociationDb} from './kth-scr-association.entity';
import {DeliveriesDb} from './deliveries.entity';
import {DateTime} from 'luxon';

export type InclukathonProgramDocument = InclukathonProgramDb & Document;

@Schema({collection: INCLUKATHON_PROGRAM_COLLECTION_NAME})
export class InclukathonProgramDb {
	_id!: string;

	@Prop()
	name: string;

	@Prop()
	explanation: string;

	@Prop()
	bannerImgPath: string;

	@Prop()
	programImgPath: string;

	@Prop()
	startDate: DateTime;

	@Prop()
	endDate: DateTime;

	@Prop()
	subject: string;

	/* BOITE A IDEE */
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: BAI_COLLECTION_NAME,
			},
		],
	})
	@Type(() => BaiDb)
	bai: BaiDb[];

	/* INCLUSCORES */
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: KTH_SCR_ASSOCIATION_COLLECTION_NAME,
			},
		],
	})
	@Type(() => KthScrAssociationDb)
	kthScrAssociation: KthScrAssociationDb[];

	/* LIVRABLES */
	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: DELIVERIES_COLLECTION_NAME,
			},
		],
	})
	@Type(() => DeliveriesDb)
	deliveries: DeliveriesDb[];
}

export const InclukathonProgramEntity = SchemaFactory.createForClass(InclukathonProgramDb);

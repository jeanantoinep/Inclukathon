import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	TEAM_ARBORESCENCE_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	TEAM_DELIVERY_COLLECTION_NAME,
} from '../../provider/collections.provider';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';
import {TeamDeliveryDb} from '../../inclukathon-program/models/team-delivery.entity';
import {TeamArborescenceDb} from '../../company/entities/teamArborescence.entity';

export type TeamDocument = TeamDb & Document;

@Schema({collection: TEAM_COLLECTION_NAME})
export class TeamDb {
	_id!: string;

	@Prop()
	name: string;

	@Prop()
	enabled: boolean;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: TEAM_DELIVERY_COLLECTION_NAME,
			},
		],
	})
	@Type(() => TeamDeliveryDb)
	teamDelivery: TeamDeliveryDb[];

	@Prop()
	projectDescription: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_ARBORESCENCE_COLLECTION_NAME,
	})
	@Type(() => TeamArborescenceDb)
	level1: TeamArborescenceDb | any;
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_ARBORESCENCE_COLLECTION_NAME,
	})
	@Type(() => TeamArborescenceDb)
	level2: TeamArborescenceDb | any;
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_ARBORESCENCE_COLLECTION_NAME,
	})
	@Type(() => TeamArborescenceDb)
	level3: TeamArborescenceDb | any;
}

export const TeamEntity = SchemaFactory.createForClass(TeamDb);

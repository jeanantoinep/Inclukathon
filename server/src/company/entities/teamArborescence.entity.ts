import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

import {TEAM_ARBORESCENCE_COLLECTION_NAME} from '../../provider/collections.provider';

export type TeamArborescenceDocument = TeamArborescenceDb & Document;

@Schema({collection: TEAM_ARBORESCENCE_COLLECTION_NAME})
export class TeamArborescenceDb {
	_id!: string;

	@Prop()
	name: string;

	@Prop()
	level: number;
}

export const TeamArborescenceEntity = SchemaFactory.createForClass(TeamArborescenceDb);

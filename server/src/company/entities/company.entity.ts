import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {UserDb} from '../../user/entity/user.entity';
import {TeamDb} from '../../team/entities/team.entity';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';

import {
	AVAILABLE_REGION_COLLECTION_NAME,
	COMPANY_COLLECTION_NAME,
	TEAM_ARBORESCENCE_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	USER_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {TeamArborescenceDb} from './teamArborescence.entity';
import {AvailableRegionDb} from './availableRegion.entity';

export type CompanyDocument = CompanyDb & Document;

@Schema({collection: COMPANY_COLLECTION_NAME})
export class CompanyDb {
	_id!: string;

	@Prop()
	name: string;

	@Prop()
	imgPath: string;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: USER_COLLECTION_NAME}],
	})
	users: UserDb[];

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: TEAM_COLLECTION_NAME}],
	})
	@Type(() => TeamDb)
	teams: TeamDb[] | any;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: TEAM_ARBORESCENCE_COLLECTION_NAME}],
	})
	@Type(() => TeamArborescenceDb)
	teamArborescence: TeamArborescenceDb[] | any;

	@Prop()
	displayRegions: boolean;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: AVAILABLE_REGION_COLLECTION_NAME}],
	})
	@Type(() => AvailableRegionDb)
	availableRegions: AvailableRegionDb[] | any;
}

export const CompanyEntity = SchemaFactory.createForClass(CompanyDb);

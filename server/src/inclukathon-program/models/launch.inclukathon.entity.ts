import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	COMPANY_COLLECTION_NAME,
	INCLUKATHON_PROGRAM_COLLECTION_NAME,
	LAUNCH_KTH_COLLECTION,
	TEAM_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Type} from 'class-transformer';
import {CompanyDb} from '../../company/entities/company.entity';
import {TeamDb} from '../../team/entities/team.entity';
import * as mongoose from 'mongoose';
import {InclukathonProgramDb} from './inclukathon-program.entity';

export type LaunchInclukathonDocument = LaunchInclukathonDb & Document;

@Schema({collection: LAUNCH_KTH_COLLECTION})
export class LaunchInclukathonDb {
	_id?: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: INCLUKATHON_PROGRAM_COLLECTION_NAME,
	})
	@Type(() => InclukathonProgramDb)
	idInclukathon: InclukathonProgramDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: COMPANY_COLLECTION_NAME,
	})
	@Type(() => CompanyDb)
	idCompany: CompanyDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_COLLECTION_NAME,
	})
	@Type(() => TeamDb)
	idTeam: TeamDb | any;
}

export const LaunchInclukathonEntity =
	SchemaFactory.createForClass(LaunchInclukathonDb);

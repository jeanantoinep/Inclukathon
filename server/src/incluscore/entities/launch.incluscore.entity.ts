import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	COMPANY_COLLECTION_NAME,
	INCLUSCORE_COLLECTION_NAME,
	LAUNCH_SCR_COLLECTION,
	TEAM_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Type} from 'class-transformer';
import {CompanyDb} from '../../company/entities/company.entity';
import {IncluscoreDb} from './incluscore.entity';
import {TeamDb} from '../../team/entities/team.entity';
import * as mongoose from 'mongoose';
import {UserThemeIncluscoreDb} from './userTheme.entity';

export type LaunchIncluscoreDocument = LaunchIncluscoreDb & Document;

@Schema({collection: LAUNCH_SCR_COLLECTION})
export class LaunchIncluscoreDb {
	_id?: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: INCLUSCORE_COLLECTION_NAME,
	})
	@Type(() => IncluscoreDb)
	idIncluscore: IncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: COMPANY_COLLECTION_NAME,
	})
	@Type(() => CompanyDb)
	idCompany: CompanyDb | any;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: USER_THEME_SCR_COLLECTION_NAME,
			},
		],
	})
	@Type(() => UserThemeIncluscoreDb)
	userThemes: UserThemeIncluscoreDb[];
}

export const LaunchIncluscoreEntity = SchemaFactory.createForClass(LaunchIncluscoreDb);

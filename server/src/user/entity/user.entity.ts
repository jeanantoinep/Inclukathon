import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import {Type} from 'class-transformer';
import {TeamDb} from '../../team/entities/team.entity';
import {CompanyDb} from '../../company/entities/company.entity';
import {
	AVAILABLE_REGION_COLLECTION_NAME,
	COMPANY_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	USER_COLLECTION_NAME,
	WEBINAR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {ILang} from '../../translations/LangUtils';
import {WebinarDb} from '../../webinar/entities/webinar.entity';
import {AvailableRegionDb} from '../../company/entities/availableRegion.entity';

export type UserDocument = UserDb & Document;

@Schema({collection: USER_COLLECTION_NAME})
export class UserDb {
	_id?: any;

	@Prop()
	firstName: string;

	@Prop()
	lastName: string;

	@Prop()
	enabled?: boolean;

	@Prop()
	email: string;

	@Prop()
	pwd?: string;

	@Prop()
	createdFromIncluscore?: boolean;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_COLLECTION_NAME,
	})
	@Type(() => TeamDb)
	teamId?: TeamDb | any;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: TEAM_COLLECTION_NAME}],
	})
	@Type(() => TeamDb)
	teamIds?: TeamDb[]; // todo to remove;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: TEAM_COLLECTION_NAME}],
	})
	@Type(() => TeamDb)
	manageTeams?: TeamDb[] | any;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: TEAM_COLLECTION_NAME,
			},
		],
	})
	@Type(() => TeamDb)
	juryOfTeams?: TeamDb[] | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: COMPANY_COLLECTION_NAME,
	})
	@Type(() => CompanyDb)
	companyId?: CompanyDb | any;

	@Prop()
	companyAdmin?: boolean;

	@Prop()
	superAdmin?: boolean;

	@Prop()
	avatarImgPath?: string;

	@Prop()
	studentNumber?: string;

	@Prop()
	presentationVideoPath?: string;

	@Prop()
	jobName?: string;

	@Prop()
	squadName?: string;

	@Prop()
	hasAPassword?: boolean;

	@Prop({default: ILang.FR})
	lang?: ILang;

	@Prop()
	npsNotation: number;

	@Prop()
	npsComment: string;

	@Prop({
		type: [{type: mongoose.Schema.Types.ObjectId, ref: WEBINAR_COLLECTION_NAME}],
	})
	@Type(() => WebinarDb)
	webinars?: WebinarDb[] | any[];

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: AVAILABLE_REGION_COLLECTION_NAME,
	})
	@Type(() => AvailableRegionDb)
	region?: AvailableRegionDb | any;
}

export const UserEntity = SchemaFactory.createForClass(UserDb);

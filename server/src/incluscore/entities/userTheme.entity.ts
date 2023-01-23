import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	LAUNCH_SCR_COLLECTION,
	TEAM_COLLECTION_NAME,
	THEMES_SCR_COLLECTION_NAME,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {UserAnswerIncluscoreDb} from './userAnswer.entity';
import {Type} from 'class-transformer';
import * as mongoose from 'mongoose';
import {UserDb} from '../../user/entity/user.entity';
import {ThemesIncluscoreDb} from './themes.entity';
import {LaunchIncluscoreDb} from './launch.incluscore.entity';
import {TeamDb} from '../../team/entities/team.entity';

export type UserThemeIncluscoreDocument = UserThemeIncluscoreDb & Document;

@Schema({collection: USER_THEME_SCR_COLLECTION_NAME})
export class UserThemeIncluscoreDb {
	_id?: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: USER_COLLECTION_NAME,
	})
	@Type(() => UserDb)
	userId: UserDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: THEMES_SCR_COLLECTION_NAME,
	})
	@Type(() => ThemesIncluscoreDb)
	themeId: ThemesIncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: LAUNCH_SCR_COLLECTION,
	})
	@Type(() => LaunchIncluscoreDb)
	launchId: LaunchIncluscoreDb | any;

	@Prop()
	answeredAll: boolean;

	@Prop()
	score: number;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: USER_ANSWER_SCR_COLLECTION_NAME,
			},
		],
	})
	@Type(() => UserAnswerIncluscoreDb)
	answers: UserAnswerIncluscoreDb[] | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_COLLECTION_NAME,
	})
	@Type(() => TeamDb)
	teamId: TeamDb | any;
}

export const UserThemeIncluscoreEntity = SchemaFactory.createForClass(UserThemeIncluscoreDb);

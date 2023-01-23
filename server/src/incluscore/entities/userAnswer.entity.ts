import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
	LAUNCH_SCR_COLLECTION,
	PROPOSITIONS_SCR_COLLECTION_NAME,
	QUESTIONS_SCR_COLLECTION_NAME,
	TEAM_COLLECTION_NAME,
	THEMES_SCR_COLLECTION_NAME,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Type} from 'class-transformer';
import {QuestionsIncluscoreDb} from './questions.entity';
import * as mongoose from 'mongoose';
import {PropositionsIncluscoreDb} from './propositions.entity';
import {LaunchIncluscoreDb} from './launch.incluscore.entity';
import {ThemesIncluscoreDb} from './themes.entity';
import {UserDb} from '../../user/entity/user.entity';
import {TeamDb} from '../../team/entities/team.entity';

export type UserAnswerIncluscoreDocument = UserAnswerIncluscoreDb & Document;

@Schema({collection: USER_ANSWER_SCR_COLLECTION_NAME})
export class UserAnswerIncluscoreDb {
	_id!: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: QUESTIONS_SCR_COLLECTION_NAME,
	})
	@Type(() => QuestionsIncluscoreDb)
	questionId: QuestionsIncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: PROPOSITIONS_SCR_COLLECTION_NAME,
	})
	@Type(() => PropositionsIncluscoreDb)
	userAnswer: PropositionsIncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: LAUNCH_SCR_COLLECTION,
	})
	@Type(() => LaunchIncluscoreDb)
	launchId: LaunchIncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: THEMES_SCR_COLLECTION_NAME,
	})
	@Type(() => ThemesIncluscoreDb)
	themeId: ThemesIncluscoreDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: USER_COLLECTION_NAME,
	})
	@Type(() => UserDb)
	userId: UserDb | any;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: TEAM_COLLECTION_NAME,
	})
	@Type(() => TeamDb)
	teamId: TeamDb | any;

	@Prop()
	isAGoodAnswer: boolean;
}

export const UserAnswerIncluscoreEntity = SchemaFactory.createForClass(UserAnswerIncluscoreDb);

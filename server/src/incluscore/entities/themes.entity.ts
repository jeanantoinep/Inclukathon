import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {QUESTIONS_SCR_COLLECTION_NAME, THEMES_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {QuestionsIncluscoreDb} from './questions.entity';
import {Type} from 'class-transformer';
import * as mongoose from 'mongoose';

export type ThemesIncluscoreDocument = ThemesIncluscoreDb & Document;

@Schema({collection: THEMES_SCR_COLLECTION_NAME})
export class ThemesIncluscoreDb {
	_id?: string;

	@Prop()
	name: string;
	@Prop()
	'name-en': string;
	@Prop()
	'name-es': string;

	@Prop()
	enabled: boolean;

	@Prop()
	imgPath: string;

	@Prop()
	imgPath2: string;

	@Prop()
	imgPath3: string;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: QUESTIONS_SCR_COLLECTION_NAME,
			},
		],
	})
	@Type(() => QuestionsIncluscoreDb)
	questions: QuestionsIncluscoreDb[];
}

export const ThemesIncluscoreEntity = SchemaFactory.createForClass(ThemesIncluscoreDb);

import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {PROPOSITIONS_SCR_COLLECTION_NAME, QUESTIONS_SCR_COLLECTION_NAME} from '../../provider/collections.provider';
import {PropositionsIncluscoreDb} from './propositions.entity';
import {Type} from 'class-transformer';
import * as mongoose from 'mongoose';

export type QuestionsIncluscoreDocument = QuestionsIncluscoreDb & Document;

@Schema({collection: QUESTIONS_SCR_COLLECTION_NAME})
export class QuestionsIncluscoreDb {
	_id?: string;

	@Prop()
	title: string;
	@Prop()
	'title-en': string;
	@Prop()
	'title-es': string;

	@Prop()
	enabled: boolean;

	@Prop()
	answerExplanation: string;
	@Prop()
	'answerExplanation-en': string;
	@Prop()
	'answerExplanation-es': string;

	@Prop({
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: PROPOSITIONS_SCR_COLLECTION_NAME,
			},
		],
	})
	@Type(() => PropositionsIncluscoreDb)
	propositions: PropositionsIncluscoreDb[];
}

export const QuestionsIncluscoreEntity = SchemaFactory.createForClass(QuestionsIncluscoreDb);

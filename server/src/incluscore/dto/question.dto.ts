import {QuestionsIncluscoreDb, QuestionsIncluscoreDocument} from '../entities/questions.entity';
import {IsDefined, IsNotEmpty} from 'class-validator';
import {PropositionDto} from './proposition.dto';

export class QuestionDto {
	constructor(qDb: QuestionsIncluscoreDb) {
		this.id = (qDb as QuestionsIncluscoreDocument)._id;
		this.title = qDb.title;
		this['title-en'] = qDb['title-en'];
		this['title-es'] = qDb['title-es'];
		this.enabled = qDb.enabled;
		this.answerExplanation = qDb.answerExplanation;
		this['answerExplanation-en'] = qDb['answerExplanation-en'];
		this['answerExplanation-es'] = qDb['answerExplanation-es'];
		this.propositions = qDb.propositions?.map((p) => new PropositionDto(p));
	}
	id: string;
	@IsDefined()
	@IsNotEmpty()
	title: string;
	'title-en': string;
	'title-es': string;
	enabled: boolean;
	answerExplanation: string;
	'answerExplanation-en': string;
	'answerExplanation-es': string;
	propositions: PropositionDto[];
}

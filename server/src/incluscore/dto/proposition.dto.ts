import {PropositionsIncluscoreDb, PropositionsIncluscoreDocument} from '../entities/propositions.entity';
import {IsDefined, IsNotEmpty} from 'class-validator';

export class PropositionDto {
	constructor(pDb: PropositionsIncluscoreDb) {
		this.id = (pDb as PropositionsIncluscoreDocument)._id;
		this.title = pDb.title;
		this['title-en'] = pDb['title-en'];
		this['title-es'] = pDb['title-es'];
		this.enabled = pDb.enabled;
		this.isAGoodAnswer = pDb.isAGoodAnswer;
	}
	id?: string;
	@IsDefined()
	@IsNotEmpty()
	title: string;
	'title-en': string;
	'title-es': string;
	enabled: boolean;
	isAGoodAnswer: boolean;
}

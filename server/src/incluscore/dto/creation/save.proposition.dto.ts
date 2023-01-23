import {PartialType} from '@nestjs/mapped-types';
import {PropositionsIncluscoreDb} from '../../entities/propositions.entity';

export class SavePropositionDto extends PartialType(PropositionsIncluscoreDb) {
	id?: string;
	incluscoreQuestionId: string;
}

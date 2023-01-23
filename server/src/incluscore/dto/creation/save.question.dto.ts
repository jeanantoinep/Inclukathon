import {PartialType} from '@nestjs/mapped-types';
import {QuestionsIncluscoreDb} from '../../entities/questions.entity';

export class SaveQuestionDto extends PartialType(QuestionsIncluscoreDb) {
	id?: string;
	incluscoreThemeId: string;
}

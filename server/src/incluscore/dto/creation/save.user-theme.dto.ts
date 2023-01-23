import {PartialType} from '@nestjs/mapped-types';
import {UserThemeIncluscoreDb} from '../../entities/userTheme.entity';
import {UserAnswerIncluscoreDb} from '../../entities/userAnswer.entity';

export class SaveUserAnswerDto extends PartialType(UserAnswerIncluscoreDb) {
	_id?: string; // server only
	id?: string;
}

export class SaveUserThemeDto extends PartialType(UserThemeIncluscoreDb) {
	_id?: string; // server only
	id?: string;
	answer: SaveUserAnswerDto;
}

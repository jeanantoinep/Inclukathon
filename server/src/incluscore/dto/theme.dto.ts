import {ThemesIncluscoreDb, ThemesIncluscoreDocument} from '../entities/themes.entity';
import {IsDefined, IsNotEmpty} from 'class-validator';
import {QuestionDto} from './question.dto';

export class ThemeDto {
	constructor(themeDb: ThemesIncluscoreDb) {
		this.id = (themeDb as ThemesIncluscoreDocument)?._id;
		this.name = themeDb?.name;
		this['name-en'] = themeDb ? themeDb['name-en'] : null;
		this['name-es'] = themeDb ? themeDb['name-es'] : null;
		this.enabled = themeDb?.enabled;
		this.imgPath = themeDb?.imgPath;
		this.imgPath2 = themeDb?.imgPath2;
		this.imgPath3 = themeDb?.imgPath3;
		this.questions = themeDb?.questions?.map((q) => new QuestionDto(q));
	}
	id!: string;
	@IsDefined()
	@IsNotEmpty()
	name: string;
	'name-en': string;
	'name-es': string;
	enabled: boolean;
	imgPath: string;
	imgPath2: string;
	imgPath3: string;
	questions: QuestionDto[];
}

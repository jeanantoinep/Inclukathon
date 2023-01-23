import {UserThemeIncluscoreDb, UserThemeIncluscoreDocument} from '../entities/userTheme.entity';
import {UserDto} from '../../user/dto/user.dto';
import {ThemeDto} from './theme.dto';
import {UserAnswerDto} from './user-answer.dto';
import {TeamDto} from '../../team/dto/team.dto';

export class UserThemeDto {
	constructor(utDb: UserThemeIncluscoreDb) {
		this.id = (utDb as UserThemeIncluscoreDocument)._id;
		if (utDb.userId?._id) {
			this.userId = new UserDto(utDb.userId);
		}
		if (utDb.themeId?._id) {
			this.themeId = new ThemeDto(utDb.themeId);
		}
		if (utDb.teamId?._id) {
			this.teamId = new TeamDto(utDb.teamId);
		}
		this.launchId = utDb.launchId;
		this.answeredAll = utDb.answeredAll;
		this.score = utDb.score;
		if (utDb?.answers?.length > 0) {
			this.answers = utDb.answers.map((a) => new UserAnswerDto(a));
		}
	}

	id: string;
	userId: UserDto;
	themeId: ThemeDto;
	launchId: string;
	answeredAll: boolean;
	score: number;
	answers: UserAnswerDto[];
	teamId: TeamDto;
}

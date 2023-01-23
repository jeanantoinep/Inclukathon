import {UserAnswerIncluscoreDb, UserAnswerIncluscoreDocument} from '../entities/userAnswer.entity';
import {QuestionDto} from './question.dto';
import {PropositionDto} from './proposition.dto';
import {TeamDto} from '../../team/dto/team.dto';
import {UserDto} from '../../user/dto/user.dto';
import {ThemeDto} from './theme.dto';
import {LaunchIncluscoreDto} from './launch.incluscore.dto';

export class UserAnswerDto {
	constructor(uDb: UserAnswerIncluscoreDb) {
		this.id = (uDb as UserAnswerIncluscoreDocument)._id;
		if (uDb.questionId) {
			this.questionId = new QuestionDto(uDb.questionId);
		}
		if (uDb.userAnswer) {
			this.userAnswer = new PropositionDto(uDb.userAnswer);
		}
		if (uDb.launchId?._id) {
			this.launchId = new LaunchIncluscoreDto(uDb.launchId);
		}
		if (uDb.themeId?._id) {
			this.themeId = new ThemeDto(uDb.themeId);
		}
		if (uDb.userId?._id) {
			this.userId = new UserDto(uDb.userId);
		}
		if (uDb.teamId?._id) {
			this.teamId = new TeamDto(uDb.teamId);
		}
		this.isAGoodAnswer = uDb.isAGoodAnswer;
	}
	id?: string;
	questionId: QuestionDto | any;
	userAnswer: PropositionDto | any;
	hasUpdate?: boolean; // only for save endpoint
	_id?: string; // only for save endpoint
	launchId: LaunchIncluscoreDto;
	themeId: ThemeDto;
	userId: UserDto;
	teamId: TeamDto;
	isAGoodAnswer: boolean;
}

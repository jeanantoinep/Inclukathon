import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UserThemeIncluscoreDb, UserThemeIncluscoreDocument} from '../entities/userTheme.entity';
import {
	PROPOSITIONS_SCR_COLLECTION_NAME,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {UserThemeDto} from '../dto/user-theme.dto';
import {UserAnswerIncluscoreDb, UserAnswerIncluscoreDocument} from '../entities/userAnswer.entity';
import {SaveUserThemeDto} from '../dto/creation/save.user-theme.dto';
import {IncluscoreService} from '../incluscore.service';
import {ThemeIncluscoreService} from '../theme/theme.service';
import {PropositionIncluscoreService} from '../theme/proposition.service';
import {LaunchIncluscoreService} from './launch.incluscore.service';
import {PropositionsIncluscoreDb, PropositionsIncluscoreDocument} from '../entities/propositions.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class UserThemeService {
	constructor(
		@InjectModel(USER_THEME_SCR_COLLECTION_NAME)
		private readonly userThemeDb: Model<UserThemeIncluscoreDocument>,
		@InjectModel(USER_ANSWER_SCR_COLLECTION_NAME)
		private readonly userAnswerDb: Model<UserAnswerIncluscoreDocument>,
		private readonly themeIncluscoreService: ThemeIncluscoreService,
		private readonly propositionService: PropositionIncluscoreService,
		private readonly incluscoreService: IncluscoreService,
		private readonly launchService: LaunchIncluscoreService,
	) {}

	public static readonly SCORE_FOR_INCLUCARD = 50;
	public static readonly SCORE_FOR_INCLUSCORE = 100;

	async saveUserTheme(update: SaveUserThemeDto, answer: UserAnswerIncluscoreDb): Promise<UserThemeIncluscoreDb> {
		let userThemeToSave: UserThemeIncluscoreDb = await this.userThemeDb.findOne({
			userId: new mongoose.Types.ObjectId(update.userId),
			themeId: new mongoose.Types.ObjectId(update.themeId),
			launchId: new mongoose.Types.ObjectId(update.launchId),
		});
		if (userThemeToSave) {
			userThemeToSave.answers.push(answer._id);
		} else {
			const userId = update.userId;
			const themeId = update.themeId;
			const launchId = update.launchId;
			if (!userId || !themeId || !launchId) {
				console.debug('K.O saving user theme');
				throw 'No existing user theme for this id and props are missing for creating a new one';
			}
			console.debug('new user theme');
			userThemeToSave = new this.userThemeDb({
				userId,
				themeId,
				launchId,
				teamId: update.teamId,
				answers: [answer._id],
				score: 0,
			} as UserThemeIncluscoreDb);
		}
		userThemeToSave = await this.retrieveUserThemeData(userThemeToSave, update, answer.userAnswer);
		const savedUserTheme = await (userThemeToSave as UserThemeIncluscoreDocument).save();
		return this.findOne(savedUserTheme._id); // populate
	}

	/**
	 * Recalculate this well known front data in backend for better
	 * data cohesion and avoid user to modify data at his compliance
	 * -> required answers already been set in userThemeToSave
	 * @param userThemeToSave
	 * @param update
	 * @param propositionChosenId
	 */
	async retrieveUserThemeData(
		userThemeToSave: UserThemeIncluscoreDb,
		update: SaveUserThemeDto,
		propositionChosenId: string,
	): Promise<UserThemeIncluscoreDb> {
		const nbThemeQuestions = await this.themeIncluscoreService.getNbQuestions(update.themeId);
		userThemeToSave.answeredAll = nbThemeQuestions <= userThemeToSave.answers?.length;
		const p: PropositionsIncluscoreDb = await this.propositionService.findOne(propositionChosenId);
		const isInclucardLaunch = await this.launchService.isInclucardLaunch(update.launchId);
		if (p.isAGoodAnswer) {
			userThemeToSave.score = isInclucardLaunch
				? userThemeToSave.score + UserThemeService.SCORE_FOR_INCLUCARD
				: userThemeToSave.score + UserThemeService.SCORE_FOR_INCLUSCORE;
		}
		return userThemeToSave;
	}

	async saveUserAnswerAndUserTheme(update: SaveUserThemeDto): Promise<UserThemeIncluscoreDb> {
		const {userId, themeId, launchId, answer} = update;
		const utWithOtherId = await this.userThemeDb
			.findOne(
				{
					userId: new mongoose.Types.ObjectId(userId),
					themeId: new mongoose.Types.ObjectId(themeId),
					launchId: new mongoose.Types.ObjectId(launchId),
				},
				{_id: 1, answers: 1},
			)
			.populate({
				path: 'answers',
				match: {
					questionId: new mongoose.Types.ObjectId(answer.questionId),
				},
			});
		if (utWithOtherId?.answers?.length > 0) {
			console.debug('K.O saving answer, return user theme with already existing one answer for this question');
			return this.findOne(utWithOtherId._id);
		}
		console.debug('New user answer');
		const createdUserAnswer = new this.userAnswerDb(answer);
		const p = await this.propositionService.findOne(answer.userAnswer);
		createdUserAnswer.isAGoodAnswer = p.isAGoodAnswer;
		const savedUserAnswer = await createdUserAnswer.save();
		return await this.saveUserTheme(update, savedUserAnswer);
	}

	async findOne(id: string): Promise<UserThemeIncluscoreDb> {
		return this.userThemeDb.findById(id).populate({
			path: 'answers',
			populate: [{path: 'userAnswer'}],
		});
	}

	async findAll(): Promise<UserThemeDto[]> {
		const userThemeDbs: UserThemeIncluscoreDb[] = await this.userThemeDb
			.find()
			.populate({
				path: 'themeId',
				populate: {
					path: 'questions',
					populate: {path: 'propositions'},
				},
			})
			.populate('userId')
			.populate({
				path: 'answers',
				populate: [{path: 'questionId', populate: 'propositions'}, {path: 'userAnswer'}],
			});
		return userThemeDbs.map((u) => new UserThemeDto(u));
	}

	async findByLaunchId(launchId: string): Promise<UserThemeDto[]> {
		const userThemeDbs = await this.userThemeDb
			.find({launchId})
			.populate('userId')
			.populate({
				path: 'themeId',
				populate: {
					path: 'questions',
					populate: {path: 'propositions'},
				},
			})
			.populate({
				path: 'answers',
				populate: [{path: 'questionId', populate: 'propositions'}, {path: 'userAnswer'}],
			});
		return userThemeDbs.map((u) => new UserThemeDto(u));
	}

	async findByUserId(userId: any): Promise<UserThemeDto[]> {
		const userThemeDbs = await this.userThemeDb
			.find({userId})
			.populate('userId')
			.populate({
				path: 'themeId',
				populate: {
					path: 'questions',
					populate: {path: 'propositions'},
				},
			})
			.populate({
				path: 'answers',
				populate: [{path: 'questionId', populate: 'propositions'}, {path: 'userAnswer'}],
			});
		return userThemeDbs.map((u) => new UserThemeDto(u));
	}

	async deleteOne(id: string): Promise<UserThemeDto[]> {
		const userTheme: UserThemeIncluscoreDb = await this.userThemeDb
			.findById(id)
			.populate({path: 'answers', select: '_id'});
		const userId = userTheme.userId;
		const idAnswersToRemove = userTheme.answers.map((a) => (a as UserAnswerIncluscoreDocument)._id);
		await this.userAnswerDb.deleteMany({_id: {$in: idAnswersToRemove}});
		await this.userThemeDb.findByIdAndDelete(id);
		return this.findByUserId(userId);
	}

	async removeUserAnswers(idUser: string) {
		const userThemes: UserThemeIncluscoreDb[] = await this.userThemeDb
			.find({userId: idUser})
			.populate({path: 'answers', select: '_id'});
		for (const userTheme of userThemes) {
			const idAnswersToRemove = userTheme.answers.map((a) => (a as UserAnswerIncluscoreDocument)._id);
			await this.userAnswerDb.deleteMany({
				_id: {$in: idAnswersToRemove},
			});
			await this.deleteOne(userTheme._id);
		}
	}

	async populateUT() {
		const uts: UserThemeIncluscoreDb[] = await this.userThemeDb
			.find()
			.populate('userId')
			.populate({path: 'answers', populate: 'userAnswer'});
		for (const ut of uts) {
			ut.teamId = ut.userId.teamId;
			for (const utA of ut.answers) {
				const answer = utA as UserAnswerIncluscoreDb;
				answer.teamId = ut.userId.teamId;
				answer.launchId = ut.launchId;
				answer.themeId = ut.themeId;
				answer.userId = ut.userId.id;
				answer.isAGoodAnswer = (answer.userAnswer as PropositionsIncluscoreDb)?.isAGoodAnswer;
				await (answer as UserAnswerIncluscoreDocument).save();
			}
			await (ut as UserThemeIncluscoreDocument).save();
		}
	}
}

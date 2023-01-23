import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {
	LAUNCH_SCR_COLLECTION,
	USER_ANSWER_SCR_COLLECTION_NAME,
	USER_THEME_SCR_COLLECTION_NAME,
} from '../../provider/collections.provider';
import {Aggregate, Model} from 'mongoose';
import {LaunchIncluscoreDb, LaunchIncluscoreDocument} from '../entities/launch.incluscore.entity';
import {UserThemeIncluscoreDb} from '../entities/userTheme.entity';
import {IncluscoreDb} from '../entities/incluscore.entity';
import {userThemesByLaunchIdWithNbThemeQuery} from '../../queries/userThemesByLaunchIdWithNbThemeQuery';
import {userThemesByLaunchIdWithAnsweredAllTrueQuery} from '../../queries/userThemesByLaunchIdWithAnsweredAllTrueQuery';
import {
	userThemesFinishedByThemeIdQuery,
	userThemesFinishedByThemeIdWithMaybeSomeUsersDuplicateQuery,
} from '../../queries/userThemesFinishedByThemeIdQuery';
import {usersWithAtLeastOneAnswerByLaunchIdQuery} from '../../queries/usersWithAtLeastOneAnswerByLaunchIdQuery';
import {begunThemesCount, finishedThemesCount} from '../../queries/answersCountByThemeIdQuery';
import {answersCountByQuestionIdQuery} from '../../queries/answersCountByQuestionIdQuery';
import {averageScoreQuery} from '../../queries/averageScoreQuery';
import {
	allAnswersOfThisLaunchWithoutCondition,
	anormalAnswersOfThisLaunch,
} from '../../queries/anormalAnswersOfThisLaunch';
import {propositionsChosenCount} from '../../queries/propositionsChosenCount';
import {UserThemeService} from './userTheme.service';
import {UserAnswerIncluscoreDb} from '../entities/userAnswer.entity';
import * as mongoose from 'mongoose';

interface UserThemeByLaunchStatRequest {
	idLaunch: string;
	nbThemesMax: number;
}

interface UserThemeByThemeStatRequest {
	idLaunch: string;
	idTheme: string;
}

interface UserThemeByQuestionStatRequest {
	idLaunch: string;
	idTheme: string;
	idQuestion: string;
}

interface UserThemeByPropositionStatRequest {
	idLaunch: string;
	idTheme: string;
	idQuestion: string;
	idProposition: string;
}

interface UserThemeByIdQuestionFacetResults {
	goodAnswersCountByQuestionIdQuery: number;
	badAnswersCountByQuestionIdQuery: number;
}

interface UserThemeByIdPropositionFacetResults {
	propositionChosenCount: number;
}

interface UserThemeByIdThemeFacetResults {
	scoreMax: number;
	nbQuestion: number;
	averageScore: number;
	haveFinishedThemeCount: number;
	finishedThemeDuplicateCount: number;
	goodAnswersCountByThemeIdQuery: number;
	badAnswersCountByThemeIdQuery: number;
}

export interface SingleQuestionStat extends UserThemeByQuestionStatRequest {
	userQuestionsStats: UserThemeByIdQuestionFacetResults;
	propositionsStats?: SinglePropositionStat[];
}

export interface SinglePropositionStat extends UserThemeByPropositionStatRequest {
	idProposition: string;
	idQuestion: string;
	userPropositionsStats: UserThemeByIdPropositionFacetResults;
}

export interface SingleThemeStat extends UserThemeByThemeStatRequest {
	userThemesStats: UserThemeByIdThemeFacetResults;
	questionsStats?: SingleQuestionStat[];
}

interface UserThemeByIdLaunchFacetResults {
	scoreMax: number;
	nbThemes: number;
	nbQuestion: number;
	averageScore: number;
	anormalUsers: number;
	begunThemesCount: number;
	finishedThemesCount: number;
	anormalAnswersCount: number;
	allAnswersOfThisLaunchWithoutConditionCount: number;
	anormalCountOfAnswers: number;
	totalUsers: number;
	usersWhoFinishedAllThemes: number;
	usersWithAtLeastOneAnswerCount: number;
}

export interface StatsMainObject {
	idLaunch: string;
	userThemesStats: UserThemeByIdLaunchFacetResults;
	themesStats: SingleThemeStat[];
}

@Injectable()
export class LScrStatService {
	constructor(
		@InjectModel(LAUNCH_SCR_COLLECTION)
		private readonly launchScrDb: Model<LaunchIncluscoreDocument>,
		@InjectModel(USER_THEME_SCR_COLLECTION_NAME)
		private readonly userThemeIncluscoreDb: Model<UserThemeIncluscoreDb>,
		@InjectModel(USER_ANSWER_SCR_COLLECTION_NAME)
		private readonly userAnswerIncluscoreDb: Model<UserAnswerIncluscoreDb>,
	) {}

	static currentIdLaunch: string | null = null;
	static currentIdTheme: string | null = null;
	static currentIdQuestion: string | null = null;
	static currentIdProposition: string | null = null;
	static currentIncluscore: IncluscoreDb | null = null;
	static currentIdTeam: string | null = null;

	processAggregateResult(aggregate: Aggregate<any>[]): any {
		return aggregate.map((a) => {
			const keys = Object.keys(a);
			for (const key of keys) {
				if (a[key].length === 1 && a[key][0].items) {
					const items = a[key][0].items;
					a[key] = items ? parseInt(a[key][0].items) : 0;
				} else {
					a[key] = 0;
				}
			}
			return a;
		})[0];
	}

	/**
	 * Aggregates ONLY for userAnswerIncluscore collection, for each proposition
	 */
	async allAnswersStatsByPropositionId(): Promise<SinglePropositionStat> {
		const idLaunch = LScrStatService.currentIdLaunch;
		const idTheme = LScrStatService.currentIdTheme;
		const idQuestion = LScrStatService.currentIdQuestion;
		const idProposition = LScrStatService.currentIdProposition;
		const idTeam = LScrStatService.currentIdTeam;
		const $facet = {
			propositionChosenCount: propositionsChosenCount(idProposition, idTeam),
		};
		const aggregate = await this.userAnswerIncluscoreDb.aggregate([{$facet}], {hint: 'userAnswer'});
		return {
			idProposition,
			idQuestion,
			idTheme,
			idLaunch,
			userPropositionsStats: this.processAggregateResult(aggregate),
		};
	}

	/**
	 * Aggregates ONLY for userThemes collection, for each question
	 */
	async allUserThemesStatByQuestionId(): Promise<SingleQuestionStat> {
		const idLaunch = LScrStatService.currentIdLaunch;
		const idTheme = LScrStatService.currentIdTheme;
		const idQuestion = LScrStatService.currentIdQuestion;
		const idTeam = LScrStatService.currentIdTeam;
		const $facet = {
			goodAnswersCountByQuestionIdQuery: answersCountByQuestionIdQuery(
				idQuestion,
				idTheme,
				idLaunch,
				true,
				idTeam,
			),
			badAnswersCountByQuestionIdQuery: answersCountByQuestionIdQuery(
				idQuestion,
				idTheme,
				idLaunch,
				false,
				idTeam,
			),
		};
		const aggregate = await this.userAnswerIncluscoreDb.aggregate([{$facet}], {hint: 'userAnswer'});
		return {
			idQuestion,
			idTheme,
			idLaunch,
			userQuestionsStats: this.processAggregateResult(aggregate),
		};
	}

	/**
	 * Aggregates ONLY for userThemes collection, for each theme
	 */
	async allUserThemesStatByThemeId(): Promise<SingleThemeStat> {
		const idLaunch = LScrStatService.currentIdLaunch;
		const idTheme = LScrStatService.currentIdTheme;
		const currentIdTeam = LScrStatService.currentIdTeam;
		const $facet = {
			averageScore: averageScoreQuery(idLaunch, idTheme, currentIdTeam),
			haveFinishedThemeCount: userThemesFinishedByThemeIdQuery(idTheme, currentIdTeam),
			finishedThemeDuplicateCount: userThemesFinishedByThemeIdWithMaybeSomeUsersDuplicateQuery(
				idTheme,
				currentIdTeam,
			),
		};
		const aggregate = await this.userThemeIncluscoreDb.aggregate([{$facet}], {hint: 'launchId_1_themeId_1'});
		const $facet2 = {
			goodAnswersCountByThemeIdQuery: answersCountByQuestionIdQuery(null, idTheme, idLaunch, true, currentIdTeam),
			badAnswersCountByThemeIdQuery: answersCountByQuestionIdQuery(null, idTheme, idLaunch, false, currentIdTeam),
		};
		const aggregate2 = await this.userAnswerIncluscoreDb.aggregate([{$facet: $facet2}], {hint: 'userAnswer'});
		return {
			idTheme,
			idLaunch,
			userThemesStats: this.processAggregateResult([{...aggregate[0], ...aggregate2[0]}]),
		};
	}

	/**
	 * Aggregates ONLY for userThemes collection, for each launch
	 */
	async allUserThemesStatByLaunchId(): Promise<UserThemeByIdLaunchFacetResults> {
		const idLaunch = LScrStatService.currentIdLaunch;
		const currentIdTeam = LScrStatService.currentIdTeam;
		const nbThemesMax = LScrStatService.currentIncluscore.themes.length;
		const $facet = {
			averageScore: averageScoreQuery(idLaunch, null, currentIdTeam),
			usersWithAtLeastOneAnswerCount: usersWithAtLeastOneAnswerByLaunchIdQuery(idLaunch, currentIdTeam),
			anormalUsers: userThemesByLaunchIdWithNbThemeQuery(idLaunch, nbThemesMax, currentIdTeam),
			begunThemesCount: begunThemesCount(idLaunch, currentIdTeam),
			finishedThemesCount: finishedThemesCount(idLaunch, currentIdTeam),
			totalUsers: userThemesByLaunchIdWithNbThemeQuery(idLaunch, 0, currentIdTeam),
			usersWhoFinishedAllThemes: userThemesByLaunchIdWithAnsweredAllTrueQuery(
				idLaunch,
				nbThemesMax,
				currentIdTeam,
			),
		};
		const aggregate = await this.userThemeIncluscoreDb.aggregate([{$facet}], {hint: 'launchId_1_themeId_1'});
		const $facet2 = {
			allAnswersOfThisLaunchWithoutConditionCount: allAnswersOfThisLaunchWithoutCondition(
				idLaunch,
				currentIdTeam,
			),
			anormalAnswersCount: anormalAnswersOfThisLaunch(idLaunch, currentIdTeam),
		};
		const aggregate2 = await this.userAnswerIncluscoreDb.aggregate([{$facet: $facet2}], {hint: 'userAnswer'});
		return this.processAggregateResult([{...aggregate[0], ...aggregate2[0]}]);
	}

	// noinspection ES6MissingAwait
	/**
	 * Main method
	 */
	async getAdminCompanyIncluscoresStats(launch: LaunchIncluscoreDb, idTeam?: string): Promise<StatsMainObject> {
		LScrStatService.currentIdLaunch = launch._id;
		LScrStatService.currentIncluscore = launch.idIncluscore;
		LScrStatService.currentIdTeam = idTeam;
		const scoreForOneQuestion = LScrStatService.currentIncluscore.isInclucard
			? UserThemeService.SCORE_FOR_INCLUCARD
			: UserThemeService.SCORE_FOR_INCLUSCORE;
		const nbThemes = LScrStatService.currentIncluscore.themes.length;
		const nbQuestions = LScrStatService.currentIncluscore.themes
			.map((t) => t.questions.length)
			?.reduce((acc, curr) => acc + curr, 0);
		const nbPropositions = LScrStatService.currentIncluscore.themes
			.map((t) => t.questions.map((p) => p.propositions.length)?.reduce((acc, curr) => acc + curr), 0)
			?.reduce((acc, curr) => acc + curr, 0);
		const oneLaunchAllUserThemesStatsPromise: Promise<UserThemeByIdLaunchFacetResults> =
			this.allUserThemesStatByLaunchId();
		const themeAllUserThemesStatsPromise: Promise<SingleThemeStat>[] = [];
		const questionAllUserThemesStats: Promise<SingleQuestionStat>[] = [];
		const propositionsAllUserThemesStats: Promise<SinglePropositionStat>[] = [];
		for (const theme of LScrStatService.currentIncluscore.themes) {
			LScrStatService.currentIdTheme = theme._id;
			themeAllUserThemesStatsPromise.push(this.allUserThemesStatByThemeId());
			for (const question of theme.questions) {
				LScrStatService.currentIdQuestion = question._id;
				questionAllUserThemesStats.push(this.allUserThemesStatByQuestionId());
				for (const proposition of question.propositions) {
					LScrStatService.currentIdProposition = proposition._id;
					propositionsAllUserThemesStats.push(this.allAnswersStatsByPropositionId());
				}
			}
		}

		console.time('Promise.all mongo timeout');
		const result = await Promise.all([
			oneLaunchAllUserThemesStatsPromise,
			...themeAllUserThemesStatsPromise,
			...questionAllUserThemesStats,
			...propositionsAllUserThemesStats,
		] as any);
		console.timeEnd('Promise.all mongo timeout');

		const oneLaunchAllUserThemesStats = result[0] as any as UserThemeByIdLaunchFacetResults;
		oneLaunchAllUserThemesStats.nbThemes = nbThemes;
		oneLaunchAllUserThemesStats.nbQuestion = nbQuestions;
		oneLaunchAllUserThemesStats.scoreMax = nbQuestions * scoreForOneQuestion;
		const arrayNumbersOneToNumberOfThemes = Array.from({length: nbThemes}, (_, i) => i + 1);
		const arrayNumbersNbThemesToNbQuestions = Array.from({length: nbQuestions}, (_, i) => i + 1 + nbThemes);
		const arrayNumbersNbQuestionsToNbPropositions = Array.from(
			{length: nbPropositions},
			(_, i) => i + 1 + nbThemes + nbQuestions,
		);
		// retrieve theme stats from Promise.all
		const themesStats = arrayNumbersOneToNumberOfThemes.map((index) => {
			const singleThemeStat = result[index] as SingleThemeStat;
			// retrieve question stats from Promise.all
			const questionsStats = arrayNumbersNbThemesToNbQuestions.map((indexQuestion) => {
				const singleQuestionStat = result[indexQuestion] as SingleQuestionStat;
				// retrieve proposition stats from Promise.all
				const propositionsStats = arrayNumbersNbQuestionsToNbPropositions.map((indexProposition) => {
					return result[indexProposition] as SinglePropositionStat;
				});
				singleQuestionStat.propositionsStats = propositionsStats.filter(
					(ps) => ps.idQuestion === singleQuestionStat.idQuestion,
				);
				return singleQuestionStat;
			});
			singleThemeStat.questionsStats = questionsStats.filter((q) => q.idTheme === singleThemeStat.idTheme);
			singleThemeStat.userThemesStats.scoreMax = singleThemeStat.questionsStats.length * scoreForOneQuestion;
			singleThemeStat.userThemesStats.nbQuestion = singleThemeStat.questionsStats.length;
			return singleThemeStat;
		});
		return {
			themesStats,
			idLaunch: launch._id,
			userThemesStats: oneLaunchAllUserThemesStats,
		} as StatsMainObject;
	}
}

import {IColumnsXlsx, XlsxFormat} from './UsersToXlsx';
import {UserDto} from '../../server/src/user/dto/user.dto';
import {
	SinglePropositionStat,
	SingleQuestionStat,
	SingleThemeStat,
	StatsMainObject,
} from '../../server/src/incluscore/progression/launch.incluscore.stats.service';
import {ThemeDto} from '../../server/src/incluscore/dto/theme.dto';
import AdminSingleCompanyStatsPage from '../pages/admin/company/AdminSingleCompanyStatsPage';
import {QuestionDto} from '../../server/src/incluscore/dto/question.dto';
import {PropositionDto} from '../../server/src/incluscore/dto/proposition.dto';

interface StatXlsxRow {
	statName: string;
	value: number;
	max: number;
	percentage: string;
}

export class ScrStatsToXlsx {
	static getGenericColumns(firstColumnName: string): IColumnsXlsx[] {
		const columns: IColumnsXlsx[] = [];
		columns.push({
			label: firstColumnName,
			value: (row: StatXlsxRow) => `${row.statName}`,
		} as IColumnsXlsx);
		columns.push({
			label: 'Valeur actuelle',
			value: (row: StatXlsxRow) => `${row.value}`,
		} as IColumnsXlsx);
		columns.push({
			label: 'Valeur mesurée',
			value: (row: StatXlsxRow) => `${row.max}`,
		} as IColumnsXlsx);
		columns.push({
			label: 'Pourcentage',
			value: (row: StatXlsxRow) => `${row.percentage}`,
		} as IColumnsXlsx);
		return columns;
	}

	static getPropositionStats(
		statScr: SinglePropositionStat,
		companyUsersCount: number,
		incluscoreName: string,
		theme: ThemeDto,
		question: QuestionDto,
		proposition: PropositionDto,
		indexTheme: number,
		indexQuestion: number,
		indexProposition: number,
		totalPropositionCount: number,
	): XlsxFormat {
		const columns: IColumnsXlsx[] = [
			...ScrStatsToXlsx.getGenericColumns(proposition.title),
			{
				label: 'Bonne réponse',
				value: () => `${proposition.isAGoodAnswer ? 'Oui' : 'Non'}`,
			} as IColumnsXlsx,
		];
		const content: StatXlsxRow[] = [];
		content.push({
			statName: "Nombres d'utilisateurs qui ont choisi cette réponse",
			value: statScr.userPropositionsStats.propositionChosenCount,
			max: totalPropositionCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userPropositionsStats.propositionChosenCount,
				totalPropositionCount,
			),
		} as StatXlsxRow);
		return {
			columns,
			content,
			sheet: `page-${indexTheme + 1}-${indexQuestion + 1}-${indexProposition}`,
		};
	}

	static getQuestionStats(
		statScr: SingleQuestionStat,
		companyUsersCount: number,
		incluscoreName: string,
		theme: ThemeDto,
		question: QuestionDto,
		indexTheme: number,
		indexQuestion: number,
	): XlsxFormat {
		const columns: IColumnsXlsx[] = ScrStatsToXlsx.getGenericColumns(question.title);
		const content: StatXlsxRow[] = [];
		content.push({
			statName: "Nombres d'utilisateurs qui ont répondu à cette question",
			value:
				statScr.userQuestionsStats.badAnswersCountByQuestionIdQuery +
				statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
			max: companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userQuestionsStats.badAnswersCountByQuestionIdQuery +
					statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
				companyUsersCount,
			),
		} as StatXlsxRow);
		content.push({
			statName: 'Bonnes réponses',
			value: statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
			max:
				statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery +
				statScr.userQuestionsStats.badAnswersCountByQuestionIdQuery,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
				statScr.userQuestionsStats.goodAnswersCountByQuestionIdQuery +
					statScr.userQuestionsStats.badAnswersCountByQuestionIdQuery,
			),
		} as StatXlsxRow);
		return {
			columns,
			content,
			sheet: `page-${indexTheme + 1}-${indexQuestion + 1}`,
		};
	}

	static getThemeStats(
		statScr: SingleThemeStat,
		companyUsersCount: number,
		incluscoreName: string,
		theme: ThemeDto,
		index: number,
	): XlsxFormat {
		const columns: IColumnsXlsx[] = ScrStatsToXlsx.getGenericColumns(theme.name);
		const content: StatXlsxRow[] = [];
		content.push({
			statName: 'Score moyen',
			value: statScr.userThemesStats.averageScore,
			max: statScr.userThemesStats.scoreMax,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.averageScore,
				statScr.userThemesStats.scoreMax,
			),
		} as StatXlsxRow);
		content.push({
			statName: "Nombres d'utilisateurs qui ont terminer ce theme",
			value: statScr.userThemesStats.haveFinishedThemeCount,
			max: companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.haveFinishedThemeCount,
				companyUsersCount,
			),
		} as StatXlsxRow);
		content.push({
			statName: 'Bonnes réponses',
			value: statScr.userThemesStats.goodAnswersCountByThemeIdQuery,
			max:
				statScr.userThemesStats.goodAnswersCountByThemeIdQuery +
				statScr.userThemesStats.badAnswersCountByThemeIdQuery,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.goodAnswersCountByThemeIdQuery,
				statScr.userThemesStats.goodAnswersCountByThemeIdQuery +
					statScr.userThemesStats.badAnswersCountByThemeIdQuery,
			),
		} as StatXlsxRow);
		return {
			columns,
			content,
			sheet: `page-${index + 1}`,
		};
	}

	static getLaunchStats(
		statScr: StatsMainObject,
		companyUsersCount: number,
		incluscoreName: string,
		incluscoreThemes: ThemeDto[],
	): XlsxFormat {
		const columns: IColumnsXlsx[] = ScrStatsToXlsx.getGenericColumns(incluscoreName);
		const content: StatXlsxRow[] = [];
		content.push({
			statName: 'Score moyen',
			value: statScr.userThemesStats.averageScore,
			max: statScr.userThemesStats.scoreMax,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.averageScore,
				statScr.userThemesStats.scoreMax,
			),
		} as StatXlsxRow);
		content.push({
			statName: "Nombres d'utilisateurs avec au moins une réponse",
			value: statScr.userThemesStats.usersWithAtLeastOneAnswerCount,
			max: companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.usersWithAtLeastOneAnswerCount,
				companyUsersCount,
			),
		} as StatXlsxRow);
		content.push({
			statName: "Nombres d'utilisateurs qui ont terminer tous les themes",
			value: statScr.userThemesStats.usersWhoFinishedAllThemes,
			max: statScr.userThemesStats.usersWithAtLeastOneAnswerCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.usersWhoFinishedAllThemes,
				statScr.userThemesStats.usersWithAtLeastOneAnswerCount,
			),
		} as StatXlsxRow);
		content.push({
			statName:
				'Nombres de questions répondues (sur la valeur atteignable si tous les utilisateurs répondent à toutes les questions)',
			value: statScr.userThemesStats.allAnswersOfThisLaunchWithoutConditionCount,
			max: statScr.userThemesStats.nbQuestion * companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.allAnswersOfThisLaunchWithoutConditionCount,
				statScr.userThemesStats.nbQuestion * companyUsersCount,
			),
		});
		content.push({
			statName: 'Nombres de themes commencés',
			value: statScr.userThemesStats.begunThemesCount,
			max: statScr.userThemesStats.nbThemes * companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.begunThemesCount,
				statScr.userThemesStats.nbThemes * companyUsersCount,
			),
		});
		content.push({
			statName: 'Nombres de themes terminés',
			value: statScr.userThemesStats.finishedThemesCount,
			max: statScr.userThemesStats.nbThemes * companyUsersCount,
			percentage: AdminSingleCompanyStatsPage.getRoundPercentage(
				statScr.userThemesStats.finishedThemesCount,
				statScr.userThemesStats.nbThemes * companyUsersCount,
			),
		});
		return {
			columns,
			content,
			sheet: incluscoreName,
		};
	}

	public static allLaunchStatExport(
		statScr: StatsMainObject,
		companyUsersCount: number,
		incluscoreName: string,
		incluscoreThemes: ThemeDto[],
	): XlsxFormat[] {
		const sheetQuestions = [];
		for (let z = 0; z < incluscoreThemes.length; z++) {
			const theme = incluscoreThemes[z];
			for (let i = 0; i < theme.questions.length; i++) {
				const question = theme.questions[i];
				const statQuestion = statScr.themesStats
					.find((stat) => stat.idTheme === theme.id)
					.questionsStats.find((s) => s.idQuestion === question.id);
				sheetQuestions.push(
					ScrStatsToXlsx.getQuestionStats(
						statQuestion,
						companyUsersCount,
						incluscoreName,
						theme,
						question,
						z,
						i,
					),
				);
				let totalQuestionAnswers = 0;
				for (const propStat of statQuestion.propositionsStats) {
					totalQuestionAnswers += propStat.userPropositionsStats.propositionChosenCount;
				}
				for (let j = 0; j < question.propositions.length; j++) {
					const proposition = question.propositions[j];

					sheetQuestions.push(
						ScrStatsToXlsx.getPropositionStats(
							statQuestion.propositionsStats.find((stat) => stat.idProposition === proposition.id),
							companyUsersCount,
							incluscoreName,
							theme,
							question,
							proposition,
							z,
							i,
							j,
							totalQuestionAnswers,
						),
					);
				}
			}
		}
		const themesSheets: XlsxFormat[] = [];
		for (let i = 0; i < incluscoreThemes.length; i++) {
			themesSheets.push(
				ScrStatsToXlsx.getThemeStats(
					statScr.themesStats.find((stat) => stat.idTheme === incluscoreThemes[i].id),
					companyUsersCount,
					incluscoreName,
					incluscoreThemes[i],
					i,
				),
			);
		}
		return [
			ScrStatsToXlsx.getLaunchStats(statScr, companyUsersCount, incluscoreName, incluscoreThemes),
			...themesSheets,
			...sheetQuestions,
		];
	}
}

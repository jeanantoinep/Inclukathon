import * as React from 'react';
import {Component} from 'react';
import {
	SinglePropositionStat,
	SingleQuestionStat,
} from '../../../../../server/src/incluscore/progression/launch.incluscore.stats.service';
import {LaunchIncluscoreDto} from '../../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {ThemeDto} from '../../../../../server/src/incluscore/dto/theme.dto';
import {QuestionDto} from '../../../../../server/src/incluscore/dto/question.dto';
import AdminSingleCompanyStatsPage from '../AdminSingleCompanyStatsPage';
import './AdminStatsSingleQuestion.scss';

interface IProps {
	totalUsers: number;
	theme: ThemeDto;
	question: QuestionDto;
	stat: SingleQuestionStat;
	launchScr: LaunchIncluscoreDto;
}

export class AdminStatsSingleQuestion extends Component<IProps, any> {
	renderChart(totalQuestionAnswers: number) {
		const propositions = this.props.question.propositions;
		const statsPropositions: SinglePropositionStat[] = propositions.map((p) =>
			this.props.stat.propositionsStats.find((stat) => stat.idProposition === p.id),
		);
		const getPercentage = (
			statsPropositions: SinglePropositionStat[],
			pId: string,
			withoutPercentageSigle = false,
		) => {
			const stat = statsPropositions.find((s) => s.idProposition === pId);
			return AdminSingleCompanyStatsPage.getRoundPercentage(
				stat.userPropositionsStats.propositionChosenCount,
				totalQuestionAnswers,
				withoutPercentageSigle,
			);
		};
		const getValueDisplayed = (statsPropositions: SinglePropositionStat[], pId: string) => {
			const stat = statsPropositions.find((s) => s.idProposition === pId);
			return `${stat.userPropositionsStats.propositionChosenCount}/${totalQuestionAnswers} `;
		};
		const labels = propositions.map((p) => `(${getPercentage(statsPropositions, p.id)}) ${p.title}`);
		const data = {
			labels,
			datasets: [
				{
					data: statsPropositions.map((statProposition) =>
						getPercentage(statsPropositions, statProposition.idProposition, true),
					),
					backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
				},
			],
		};
		window.Chart.register(window.ChartDataLabels);
		new window.Chart(
			(
				document.getElementById(
					`question-propositions-chosen-count-${this.props.question.id}`,
				) as HTMLCanvasElement
			).getContext('2d'),
			{
				type: 'pie',
				data: data,
				options: {
					tooltips: {
						enabled: false,
					},
					plugins: {
						dataLabels: {
							formatter: (value, ctx) => {
								return labels[ctx.dataIndex];
							},
						},
					},
				},
			},
		);
	}

	render() {
		const {totalUsers, stat} = this.props;
		if (!stat) {
			return null;
		}
		return (
			<div className={'question-stats-component'}>
				<p className={'component-stat-title mt-3 c-strong-purple'}>{this.props.question.title}</p>
				<div className={'d-flex w-100 justify-content-around'} style={{gap: '1rem'}}>
					<div
						className={'w-50'}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<p>Nombres d'utilisateurs qui ont répondu à cette question</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userQuestionsStats.badAnswersCountByQuestionIdQuery +
								stat.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
							totalUsers,
						)}
						<p>Bonnes réponses</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userQuestionsStats.goodAnswersCountByQuestionIdQuery,
							stat.userQuestionsStats.goodAnswersCountByQuestionIdQuery +
								stat.userQuestionsStats.badAnswersCountByQuestionIdQuery,
						)}
					</div>
					<div className={'w-50'}>
						<div style={{maxWidth: '400px'}} className={'w-50 m-auto'}>
							<canvas id={`question-propositions-chosen-count-` + this.props.question.id} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		let totalQuestionAnswers = 0;
		for (const propStat of this.props.stat.propositionsStats) {
			totalQuestionAnswers += propStat.userPropositionsStats.propositionChosenCount;
		}
		this.renderChart(totalQuestionAnswers);
	}
}

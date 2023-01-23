import * as React from 'react';
import {Component} from 'react';
import {SingleThemeStat} from '../../../../../server/src/incluscore/progression/launch.incluscore.stats.service';
import {LaunchIncluscoreDto} from '../../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {ThemeDto} from '../../../../../server/src/incluscore/dto/theme.dto';
import {AdminStatsSingleQuestion} from './AdminStatsSingleQuestion';
import AdminSingleCompanyStatsPage from '../AdminSingleCompanyStatsPage';
import './AdminStatsSingleTheme.scss';

interface IProps {
	totalUsers: number;
	theme: ThemeDto;
	stat: SingleThemeStat;
	launchScr: LaunchIncluscoreDto;
}

export class AdminStatsSingleTheme extends Component<IProps, any> {
	render() {
		const {totalUsers, stat} = this.props;
		if (!stat) {
			return null;
		}
		return (
			<div className={'theme-stats-component'}>
				<div className="page-break" />
				<div className={'card mt-3'}>
					<div className={'card-body'}>
						<h1 className={'component-stat-title'}>{this.props.theme.name}</h1>
						<p>Score moyen</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.averageScore,
							stat.userThemesStats.scoreMax,
						)}
						<p>Nombres d'utilisateurs qui ont terminer ce theme</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.haveFinishedThemeCount,
							totalUsers,
						)}
						<p>Bonnes réponses</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.goodAnswersCountByThemeIdQuery,
							stat.userThemesStats.goodAnswersCountByThemeIdQuery +
								stat.userThemesStats.badAnswersCountByThemeIdQuery,
						)}
					</div>
				</div>
				{this.props.theme.questions.map((question) => (
					<AdminStatsSingleQuestion
						key={question.id}
						question={question}
						theme={this.props.theme}
						launchScr={this.props.launchScr}
						totalUsers={this.props.totalUsers}
						stat={this.props.stat.questionsStats.find((stat) => stat.idQuestion === question.id)}
					/>
				))}
			</div>
		);
	}
}

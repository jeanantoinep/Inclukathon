import * as React from 'react';
import {Component} from 'react';
import './AdminSingleCompanyStatsPage.scss';
import {AdminStatsSingleTheme} from './stats/AdminStatsSingleTheme';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {COMPANY_CTRL, LAUNCH_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {BasicFacetStatsDto} from '../../../../server/src/incluscore/dto/basic.facet.stats.dto';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';
import {withRouter} from 'react-router-dom';
import {ScrStatsToXlsx} from '../../../jsonToXlsx/ScrStatsToXlsx';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xlsx = require('json-as-xlsx');

class AdminSingleCompanyStatsPage extends Component<IRouterProps, BasicFacetStatsDto> {
	public static getRoundPercentage(value: number, total: number, withoutPercentSigle = false): string {
		if (total === 0) {
			total = 1;
		}
		const percentage = (value / total) * 100;
		const result = percentage.toFixed(2);
		return withoutPercentSigle ? result : result + '%';
	}

	public static genericPercentageStat(minValue: number, maxValue: number) {
		if (maxValue < 1) {
			return null;
		}
		const p = AdminSingleCompanyStatsPage.getRoundPercentage(minValue, maxValue);
		return (
			<div className={'single-users-stat d-flex align-items-center'}>
				<div className="progress w-100">
					<div
						style={{width: p}}
						className="progress-bar"
						role="progressbar"
						aria-valuenow={minValue}
						aria-valuemin={0}
						aria-valuemax={maxValue}
					/>
				</div>
				<div style={{whiteSpace: 'nowrap', marginLeft: '1rem', marginBottom: 0}}>
					<p className={'m-0'}>
						{minValue} / {maxValue}
					</p>
					<p className={'m-0'}>(soit {p})</p>
				</div>
			</div>
		);
	}

	todo = () => {
		return (
			<>
				<p>Repartition des scores (10% d'utilisateurs on eu 100points, etc) par theme</p>
			</>
		);
	};

	render() {
		if (!this.state || !this.state.stat) {
			return null;
		}
		const {stat, companyUsersCount, team} = this.state;
		const incluscore = this.state.launch?.idIncluscore;
		return (
			<div className={'company-stat-main-component p-3'}>
				<div className={'d-flex w-100 justify-content-between'}>
					<h1 className={'text-center'}>{team ? team?.arborescence : incluscore?.name}</h1>
					<button
						className={'btn btn-primary btn-all-colors mr-0 d-print-none'}
						onClick={() =>
							xlsx(
								ScrStatsToXlsx.allLaunchStatExport(
									stat,
									companyUsersCount,
									incluscore.name,
									incluscore.themes,
								),
								{
									fileName: 'StatsIncluScore',
									extraLength: 3,
									writeOptions: {},
								},
							)
						}
					>
						Exporter vers excel
					</button>
				</div>
				<div>
					{this.props.location.search.includes('debug') && (
						<div>
							<div>
								<p>Nombres d'utilisateurs avec une progression normale (bon nombre de themes):</p>
								{AdminSingleCompanyStatsPage.genericPercentageStat(
									stat.userThemesStats.usersWithAtLeastOneAnswerCount -
										stat.userThemesStats.anormalUsers,
									stat.userThemesStats.usersWithAtLeastOneAnswerCount,
								)}
							</div>
							<div>
								<p>Nombres de questions non dupliquées</p>
								{AdminSingleCompanyStatsPage.genericPercentageStat(
									stat.userThemesStats.allAnswersOfThisLaunchWithoutConditionCount -
										stat.userThemesStats.anormalAnswersCount,
									stat.userThemesStats.allAnswersOfThisLaunchWithoutConditionCount,
								)}
							</div>
						</div>
					)}
					<div>
						<p>Score moyen</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.averageScore,
							stat.userThemesStats.scoreMax,
						)}
					</div>
					<div>
						<p>Nombres d'utilisateurs avec au moins une réponse</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.usersWithAtLeastOneAnswerCount,
							companyUsersCount,
						)}
					</div>
					<div>
						<p>Nombres d'utilisateurs qui ont terminer tous les themes</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.usersWhoFinishedAllThemes,
							stat.userThemesStats.usersWithAtLeastOneAnswerCount,
						)}
					</div>
					<div>
						<p>Nombres de themes commencés</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.begunThemesCount,
							stat.userThemesStats.nbThemes * companyUsersCount,
						)}
					</div>
					<div>
						<p>Nombres de themes terminés</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.finishedThemesCount,
							stat.userThemesStats.nbThemes * companyUsersCount,
						)}
					</div>
					<div>
						<p>
							Nombres de questions répondues (sur la valeur atteignable si tous les utilisateurs répondent
							à toutes les questions)
						</p>
						{AdminSingleCompanyStatsPage.genericPercentageStat(
							stat.userThemesStats.allAnswersOfThisLaunchWithoutConditionCount,
							stat.userThemesStats.nbQuestion * companyUsersCount,
						)}
					</div>
				</div>
				{incluscore.themes.map((theme) => (
					<AdminStatsSingleTheme
						key={theme.id}
						theme={theme}
						launchScr={this.state.launch}
						totalUsers={companyUsersCount}
						stat={stat.themesStats.find((stat) => stat.idTheme === theme.id)}
					/>
				))}
			</div>
		);
	}

	async componentDidMount() {
		const {idCompany, idLaunch, idTeam} = this.props.match.params;
		showLoader(this.constructor.name);
		let basicStatsResponse: BasicFacetStatsDto | null = null;
		if (idTeam) {
			basicStatsResponse = await HttpRequester.getHttp(
				LAUNCH_SCR_CTRL + `/single-team-scr-stats/${idLaunch}?idTeam=${idTeam}`,
			);
		} else {
			basicStatsResponse = await HttpRequester.getHttp(LAUNCH_SCR_CTRL + `/single-launch-scr-stats/${idLaunch}`);
		}
		const company: CompanyDto = await HttpRequester.getHttp(`${COMPANY_CTRL}/${idCompany}`);
		this.setState({
			stat: basicStatsResponse.stat,
			launch: basicStatsResponse.launch,
			team: basicStatsResponse.team,
			companyUsersCount: idTeam
				? company.users.filter((u) => u.team.id === idTeam)?.length
				: company.users.length,
		} as BasicFacetStatsDto);
		hideLoader(this.constructor.name);
	}
}

export default withRouter(AdminSingleCompanyStatsPage);

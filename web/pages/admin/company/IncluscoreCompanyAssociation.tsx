import * as React from 'react';
import {Component} from 'react';
import {ToastHelper} from '../../../basics/ToastHelper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {LAUNCH_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {SaveLaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/creation/save.launch.incluscore.dto';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {incluscoreHomePath} from '../../../routes/incluscoreAppRoutes';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {adminSingleCompanyStatsByTeamPath, adminSingleCompanyStatsPath} from '../../../routes/adminRoutes';

interface IProps {
	companyId: string;
	companyName: string;
	companyTeams: TeamDto[]; // for stats
	incluscores: IncluscoreDto[];
	companyLaunches: LaunchIncluscoreDto[];
}

interface IState {
	companyLaunches: LaunchIncluscoreDto[];
	idIncluscoreSelected: string;
	idTeamStat: string;
}

export class IncluscoreCompanyAssociation extends Component<IProps, IState> {
	constructor(props) {
		super(props);
		const incluscoresAvailableToLaunch = this.incluscoresAvailableToLaunch(this.props.companyLaunches);
		const idIncluscoreSelected = incluscoresAvailableToLaunch ? incluscoresAvailableToLaunch[0]?.id || null : null;
		this.state = {
			companyLaunches: this.props.companyLaunches,
			idIncluscoreSelected,
			idTeamStat: '',
		};
	}

	incluscoresAvailableToLaunch = (companyLaunches = this.state.companyLaunches) => {
		return this.props.incluscores?.filter((i) => !companyLaunches?.find((t) => t.idIncluscore?.id === i.id));
	};

	sendIncluscoreAssociation = async () => {
		if (!this.state.idIncluscoreSelected) {
			return null;
		}
		const companyLaunches: LaunchIncluscoreDto[] = await HttpRequester.postHttp(LAUNCH_SCR_CTRL, {
			idCompany: this.props.companyId,
			idIncluscore: this.state.idIncluscoreSelected,
		} as SaveLaunchIncluscoreDto);
		const availableIncluscoresToAdd = this.incluscoresAvailableToLaunch(companyLaunches);
		this.setState({
			companyLaunches,
			idIncluscoreSelected: availableIncluscoresToAdd?.length > 0 ? availableIncluscoresToAdd[0]?.id : '',
		});
		ToastHelper.showSuccessMessage();
	};

	removeLaunchScr = async (e, launch) => {
		e.stopPropagation();
		if (!window.confirm('Supprimer définitivement le lancement ?')) {
			return;
		}
		const companyLaunches: LaunchIncluscoreDto[] = await HttpRequester.deleteHttp(LAUNCH_SCR_CTRL, {
			id: launch.id,
			idCompany: this.props.companyId,
		});
		const availableIncluscoresToAdd = this.incluscoresAvailableToLaunch(companyLaunches);
		this.setState({
			companyLaunches,
			idIncluscoreSelected: availableIncluscoresToAdd?.length > 0 ? availableIncluscoresToAdd[0]?.id : '',
		});
		ToastHelper.showSuccessMessage();
	};

	selectIncluscoreToAdd = (index: number) => {
		if (index) {
			const availableIncluscoresToAdd = this.incluscoresAvailableToLaunch(this.state?.companyLaunches);
			this.setState({
				idIncluscoreSelected: availableIncluscoresToAdd[index].id,
			});
		}
	};

	openStat(launchId: string) {
		const basePath = this.state.idTeamStat ? adminSingleCompanyStatsByTeamPath : adminSingleCompanyStatsPath;
		const teamIdPath = this.state.idTeamStat !== '' ? '/team/' + this.state.idTeamStat : '';
		const path = `${basePath}/${this.props.companyId}/launch/${launchId}${teamIdPath}`;
		return window.open(path, '_blank');
	}

	render() {
		const incluscoresAvailableToLaunch = this.incluscoresAvailableToLaunch(this.state?.companyLaunches);
		return (
			<>
				{incluscoresAvailableToLaunch.length > 0 && (
					<div className={'team-incluscore-association d-flex'}>
						<select
							className={'custom-select mr-2'}
							onChange={(e) => this.selectIncluscoreToAdd(e.target.selectedIndex)}
						>
							{incluscoresAvailableToLaunch.map((incluscore, index) => {
								return (
									<option key={index} value={incluscore.id}>
										{incluscore?.name}
									</option>
								);
							})}
						</select>
						<button
							className={'btn btn-default btn-new ml-3'}
							onClick={() => this.sendIncluscoreAssociation()}
						>
							Ajouter l'incluscore a cette entreprise
						</button>
					</div>
				)}
				{this.state.companyLaunches.find((cl) =>
					this.props.incluscores.find((i) => i.id === cl.idIncluscore.id),
				) && (
					<table className={'admin-table not-clickable'}>
						<thead>
							<tr>
								<th>Incluscores de l'entreprise {this.props.companyName}</th>
								<th>Lien vers le quiz</th>
								<th>Copier lien pour partager</th>
								<th>Statistiques</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.companyLaunches.map((association, i) => {
								return (
									<tr key={i}>
										<td>{association?.idIncluscore?.name}</td>
										<td>
											<button
												className={'btn btn-primary btn-to-launch pointer'}
												onClick={() => {
													window.open(
														window.origin + incluscoreHomePath + `?i=${association.id}`,
														'_blank',
													);
												}}
											>
												Lien vers le quiz
											</button>
										</td>
										<td>
											<button
												className={'btn btn-primary btn-to-copy pointer mr-3'}
												onClick={() => {
													this.copyTextToClipboard(
														window.origin + incluscoreHomePath + `?i=${association.id}`,
													);
													ToastHelper.showSuccessMessage('Copié dans le presse papier !');
												}}
											>
												Copier
											</button>
										</td>
										<td>
											<div className={'d-flex'}>
												<select
													className={'custom-select'}
													name="team-for-stat-scr"
													id={`team-for-stat-scr-${association.id}-${association.idIncluscore.id}`}
													value={this.state.idTeamStat}
													onChange={(e) => {
														this.setState({idTeamStat: e.target.value});
													}}
												>
													<option value={''}>Toutes équipes confondues</option>
													{this.props.companyTeams &&
														this.props.companyTeams?.map((team) => {
															return (
																<option key={team.id} value={team.id}>
																	{team.arborescence}
																</option>
															);
														})}
												</select>
												<button
													className={'btn btn-primary'}
													onClick={() => this.openStat(association?.id)}
												>
													Voir
												</button>
											</div>
										</td>
										<td>
											<FontAwesomeIcon
												icon={['fas', 'trash']}
												onClick={(e) => this.removeLaunchScr(e, association)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</>
		);
	}

	copyTextToClipboard = (text: string) => {
		if (!navigator.clipboard) {
			this.fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(
			() => {
				console.debug('Async: Copying to clipboard was successful!');
			},
			(err) => {
				console.error('Async: Could not copy text: ', err);
			},
		);
	};

	fallbackCopyTextToClipboard = (text: string) => {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');
			const msg = successful ? 'successful' : 'unsuccessful';
			console.debug('Fallback: Copying text command was ' + msg);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}

		document.body.removeChild(textArea);
	};
}

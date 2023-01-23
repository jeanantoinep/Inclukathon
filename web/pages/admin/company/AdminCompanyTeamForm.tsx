import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveTeamDto} from '../../../../server/src/team/dto/save.team.dto';
import {COMPANY_CTRL, TEAM_CTRL, USER_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {ToastHelper} from '../../../basics/ToastHelper';
import {createCompanyTeamsAdminPath} from '../../../routes/adminRoutes';
import {TeamArborescenceDto} from '../../../../server/src/company/dto/teamArborescence.dto';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

interface IState extends TeamDto {
	levels: TeamArborescenceDto[];
	juryList: UserDto[];
	managerList: UserDto[];
	currentJuryToAdd: UserDto;
	currentManagerToAdd: UserDto;
	company: CompanyDto;
}

type IProps = IRouterProps;

class AdminCompanyTeamForm extends Component<IProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			enabled: true,
			projectDescription: '',
			teamDelivery: [],
			level1: null,
			level2: null,
			level3: null,
			arborescence: '',
			levels: [],
			juryList: [],
			managerList: [],
			currentJuryToAdd: null,
			currentManagerToAdd: null,
			company: null,
		};
	}

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleSubmit = async () => {
		const oldId = this.state.id;
		const updatedTeam = await HttpRequester.postHttp(TEAM_CTRL, {
			id: this.state.id,
			name: this.state.name,
			enabled: this.state.enabled,
			companyId: this.props.match.params.idCompany,
			level1: this.state.level1,
			level2: this.state.level2,
			level3: this.state.level3,
		} as SaveTeamDto);
		this.setState({...updatedTeam});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createCompanyTeamsAdminPath}/${this.state.company.id}/team/${updatedTeam.id}`,
			);
		}
	};

	displayUserIdentity(user: UserDto) {
		return `${user.firstName} ${user.lastName} (${user.email})`;
	}

	updateJuryList = (newJuryList: UserDto[]) => {
		const availableJuryToAdd = this.getAvailableUsersToAddToJuryList(this.state.company, newJuryList);
		this.setState({
			currentJuryToAdd: availableJuryToAdd[0],
			juryList: newJuryList,
		});
	};

	updateManagerList = (newManagerList: UserDto[]) => {
		const availableManagerToAdd = this.getAvailableUsersToAddToManagerList(this.state.company, newManagerList);
		this.setState({
			currentManagerToAdd: availableManagerToAdd[0],
			managerList: newManagerList,
		});
	};

	deleteJuryFromList = async (userId: string) => {
		await HttpRequester.deleteHttp(USER_CTRL + '/remove-jury', {
			userId,
			teamId: this.state.id,
		});
		const newJuryList = this.state.juryList.filter((u) => u.id !== userId);
		this.updateJuryList(newJuryList);
		ToastHelper.showSuccessMessage();
	};

	deleteManagerFromList = async (userId: string) => {
		await HttpRequester.deleteHttp(USER_CTRL + '/remove-manager', {
			userId,
			teamId: this.state.id,
		});
		const newManagerList = this.state.managerList.filter((u) => u.id !== userId);
		this.updateManagerList(newManagerList);
		ToastHelper.showSuccessMessage();
	};

	addToJuryList = async () => {
		await HttpRequester.postHttp(USER_CTRL + '/add-jury', {
			userId: this.state.currentJuryToAdd.id,
			teamId: this.state.id,
		});
		const newJuryList = [...this.state.juryList, this.state.currentJuryToAdd];
		this.updateJuryList(newJuryList);
		ToastHelper.showSuccessMessage();
	};

	addToManagerList = async () => {
		await HttpRequester.postHttp(USER_CTRL + '/add-manager', {
			userId: this.state.currentManagerToAdd.id,
			teamId: this.state.id,
		});
		const newManagerList = [...this.state.managerList, this.state.currentManagerToAdd];
		this.updateManagerList(newManagerList);
		ToastHelper.showSuccessMessage();
	};

	getAvailableUsersToAddToJuryList = (company: CompanyDto, juryList: UserDto[]) => {
		if (!company || !company.users) {
			return [];
		}
		return company.users.filter((u) => !juryList.find((jury) => jury.id === u.id));
	};

	getAvailableUsersToAddToManagerList = (company: CompanyDto, managerList: UserDto[]) => {
		if (!company || !company.users) {
			return [];
		}
		return company.users.filter((u) => !managerList.find((manager) => manager.id === u.id));
	};

	setCurrentJuryToAdd = (e) => {
		const i = e.target.selectedIndex;
		if (i) {
			this.setState({
				currentJuryToAdd: this.getAvailableUsersToAddToJuryList(this.state.company, this.state.juryList)[i],
			});
		}
	};

	setCurrentManagerToAdd = (e) => {
		const i = e.target.selectedIndex;
		if (i) {
			this.setState({
				currentManagerToAdd: this.getAvailableUsersToAddToManagerList(
					this.state.company,
					this.state.managerList,
				)[i],
			});
		}
	};

	renderAddJuryBtn() {
		const availableUsersToAdd = this.getAvailableUsersToAddToJuryList(this.state.company, this.state.juryList);
		if (!availableUsersToAdd || availableUsersToAdd.length < 1) {
			return null;
		}
		return (
			<div className={'d-flex mt-4'}>
				<select
					key={this.state.currentJuryToAdd.id}
					className={'custom-select mr-2 mb-3'}
					onChange={this.setCurrentJuryToAdd}
					defaultValue={this.state.currentJuryToAdd.id}
				>
					{availableUsersToAdd.map((userToAdd, index) => {
						return (
							<option key={index} value={userToAdd.id}>
								{this.displayUserIdentity(userToAdd)}
							</option>
						);
					})}
				</select>
				<button className={'btn btn-default btn-new ml-3'} onClick={() => this.addToJuryList()}>
					Ajouter cet utilisateur en tant que jury de cette équipe
				</button>
			</div>
		);
	}

	renderAddManagerBtn() {
		const availableUsersToAdd = this.getAvailableUsersToAddToManagerList(
			this.state.company,
			this.state.managerList,
		);
		if (!availableUsersToAdd || availableUsersToAdd.length < 1) {
			return null;
		}
		return (
			<div className={'d-flex mt-4'}>
				<select
					key={this.state.currentManagerToAdd.id}
					className={'custom-select mr-2 mb-3'}
					onChange={this.setCurrentManagerToAdd}
					defaultValue={this.state.currentManagerToAdd.id}
				>
					{availableUsersToAdd.map((userToAdd, index) => {
						return (
							<option key={index} value={userToAdd.id}>
								{this.displayUserIdentity(userToAdd)}
							</option>
						);
					})}
				</select>
				<button className={'btn btn-default btn-new ml-3'} onClick={() => this.addToManagerList()}>
					Ajouter cet utilisateur en tant que coach de cette équipe
				</button>
			</div>
		);
	}

	renderJuryList() {
		const juryList = this.state.juryList;
		return (
			<div>
				{this.renderAddJuryBtn()}
				{(!juryList || juryList.length < 1) && <p> Aucun jury pour le moment </p>}
				{juryList &&
					juryList.map((jury) => {
						return (
							<p key={jury.id}>
								<FontAwesomeIcon
									onClick={() => this.deleteJuryFromList(jury.id)}
									icon={['fas', 'trash']}
									className={'delete-icon pointer'}
								/>
								&nbsp;
								{this.displayUserIdentity(jury)}
							</p>
						);
					})}
			</div>
		);
	}

	renderManagerList() {
		const managerList = this.state.managerList;
		return (
			<div>
				{this.renderAddManagerBtn()}
				{(!managerList || managerList.length < 1) && <p> Aucun coach pour le moment </p>}
				{managerList &&
					managerList.map((manager) => {
						return (
							<p key={manager.id}>
								<FontAwesomeIcon
									onClick={() => this.deleteManagerFromList(manager.id)}
									icon={['fas', 'trash']}
									className={'delete-icon pointer'}
								/>
								&nbsp;
								{this.displayUserIdentity(manager)}
							</p>
						);
					})}
			</div>
		);
	}

	renderTeamRights() {
		const team = this.state;
		if (!team) {
			return null;
		}
		return (
			<div className={'single-team-rights mt-4'}>
				<h2> Jury de l'équipe {team.name} </h2>
				{team && this.renderJuryList()}
				<h2> Coach de l'équipe {team.name} </h2>
				{team && this.renderManagerList()}
			</div>
		);
	}

	renderArborescenceLevel(level: number) {
		if (!this.state.levels || this.state.levels.length < 1) {
			return;
		}
		const levelKey = `level${level}`;
		return (
			<div className={'mt-3'}>
				<p className={'m-auto'}>Niveau {level}</p>
				<select
					name={levelKey}
					id={levelKey}
					className={'custom-select'}
					value={this.state[levelKey]?.id}
					onChange={(e) => this.handleValue((e.target as HTMLSelectElement).value, levelKey)}
				>
					<option key={'void'} value={-1}>
						Aucun
					</option>
					{this.state.levels
						.filter((l) => l.level === level)
						.map((levelIteration: TeamArborescenceDto) => {
							return (
								<option key={levelKey + '-' + levelIteration.id} value={levelIteration.id}>
									{levelIteration.name}
								</option>
							);
						})}
				</select>
			</div>
		);
	}

	renderArborescence() {
		return (
			<>
				<hr />
				<h1>Arborescence de l'équipe</h1>
				<p>{this.state.arborescence}</p>
				<div>{this.renderArborescenceLevel(1)}</div>
				<div>{this.renderArborescenceLevel(2)}</div>
				<div>{this.renderArborescenceLevel(3)}</div>
			</>
		);
	}

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'une équipe </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						label={'Nom'}
						inputName={'name'}
						value={this.state.name}
						type="text"
						change={this.handleValue}
					/>
					<BasicInput
						label={'Activé'}
						inputName={'enabled'}
						value={this.state.enabled}
						type="checkbox"
						change={this.handleValue}
					/>

					{this.state.id && this.renderArborescence()}

					{this.state.id && this.renderTeamRights()}
				</form>
			</>
		);
	}

	async componentDidMount() {
		const {idCompany, idTeam} = this.props.match.params;
		let team: TeamDto = {} as TeamDto;
		let levels: TeamArborescenceDto[] = [];
		let juryList: UserDto[] = [];
		let managerList: UserDto[] = [];
		if (idCompany) {
			const company: CompanyDto = await HttpRequester.getHttp(`${COMPANY_CTRL}/${idCompany}`);
			levels = await HttpRequester.getHttp(TEAM_CTRL + '/arborescence-available/' + idCompany);
			if (idTeam) {
				team = await HttpRequester.getHttp(`${TEAM_CTRL}/${idTeam}`);
				if (company && company.users) {
					juryList = company.users.filter((u) => {
						return u.juryOfTeams?.find((t) => t.id === team.id) !== undefined;
					});
					managerList = company.users.filter((u) => {
						return u.manageTeams?.find((t) => t.id === team.id) !== undefined;
					});
				}
			}
			this.setState({
				...team,
				levels,
				company,
				juryList,
				managerList,
				currentJuryToAdd: this.getAvailableUsersToAddToJuryList(company, juryList)[0],
				currentManagerToAdd: this.getAvailableUsersToAddToManagerList(company, managerList)[0],
			});
		}
	}
}

export default withRouter(AdminCompanyTeamForm);

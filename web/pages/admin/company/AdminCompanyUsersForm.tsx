import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {UserThemeDto} from '../../../../server/src/incluscore/dto/user-theme.dto';
import {SaveUserDto} from '../../../../server/src/user/dto/save.user.dto';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';
import {COMPANY_CTRL, USER_CTRL, USER_THEME_SCR_CTRL} from '../../../../server/src/provider/routes.helper';
import {createCompanyUsersAdminPath} from '../../../routes/adminRoutes';
import {ToastHelper} from '../../../basics/ToastHelper';
import {AlertEmailNeeded} from '../../../basics/Alerts/AlertEmailNeeded';

interface IState extends UserDto {
	companyTeams: TeamDto[];
	userThemes: UserThemeDto[];
	companyId: string;
	teamId: string;
}

type IProps = IRouterProps;

class AdminCompanyUsersForm extends Component<IProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			firstName: '',
			lastName: '',
			enabled: true,
			team: null,
			email: '',
			companyId: '',
			companyTeams: [],
			userThemes: [],
			company: null,
			teamId: '',
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

	handleSubmit = async (state = this.state) => {
		if (!state.email?.trim() || state.email?.trim() === '') {
			return;
		}
		const oldId = state.id;
		const body = {
			...state,
			company: null,
			companyTeams: null,
			userThemes: null,
			companyId: state.companyId,
		} as SaveUserDto;
		const updatedUser: UserDto = await HttpRequester.postHttp(USER_CTRL, body);
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createCompanyUsersAdminPath}/${state.companyId}/user/${updatedUser.id}`);
		}
	};

	renderCompanyTeamsAssociationForm() {
		return (
			<>
				<p className={'admin-list-titles'}>
					Associer {this.state.firstName + ' ' + this.state.lastName} à une équipe
				</p>
				{this.state.companyTeams.map((team, index) => {
					return (
						<BasicInput
							key={index}
							id={team.id}
							inputName={'teamId'}
							label={team.arborescence}
							value={this.state.teamId === team.id}
							type="radio"
							change={this.handleValue}
						/>
					);
				})}
			</>
		);
	}

	async removeUserTheme(e, userTheme: UserThemeDto) {
		e.stopPropagation();
		if (!window.confirm("Supprimer définitivement l'historique pour ce theme ?")) {
			return;
		}
		const userThemes = await HttpRequester.deleteHttp(`${USER_THEME_SCR_CTRL}/${userTheme.id}`);
		this.setState({userThemes: userThemes});
	}

	renderUserThemes() {
		const hasUserThemes = this.state.userThemes && this.state.userThemes.length > 0;
		if (!hasUserThemes) {
			return null;
		}
		return (
			<>
				<h1> Historique </h1>
				<div>
					{this.state.userThemes.map((u, i) => {
						return (
							<div key={i}>
								{u.answers.length > 0 ? (
									<div className={'d-flex'}>
										<div className={'user-theme-cell'}>
											<p>Theme: {u.themeId.name}</p>
										</div>
										<div className={'user-theme-cell'}>
											<p>
												{' '}
												{u.answeredAll ? (
													<span className={'c-sweet-purple'}>Quiz terminé</span>
												) : (
													'Quiz non terminé'
												)}{' '}
											</p>
											<p> Score: {u.score} </p>
											<p>
												Bonnes réponses:{' '}
												{u.answers.filter((a) => a.userAnswer?.isAGoodAnswer).length} /{' '}
												{u.answers.length}
											</p>
											<p> Réponses: </p>
											<div>
												{u.answers.map((a, i) => (
													<span
														key={i}
														className={`${
															a.userAnswer?.isAGoodAnswer ? 'c-sweet-purple' : ''
														}`}
													>
														{i !== 0 ? ', ' : ''}
														{a.userAnswer?.title}
													</span>
												))}
											</div>
										</div>
										<div className={'user-theme-cell'}>
											<FontAwesomeIcon
												icon={['fas', 'trash']}
												onClick={(e) => this.removeUserTheme(e, u)}
											/>
										</div>
									</div>
								) : (
									'Quiz non commencé'
								)}
							</div>
						);
					})}
				</div>
			</>
		);
	}

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'un utilisateur </h1>
					</div>
					{(!this.state.email?.trim() || this.state.email?.trim() === '') && <AlertEmailNeeded />}
					<BasicInput
						label={'Prénom'}
						inputName={'firstName'}
						value={this.state.firstName}
						type="text"
						change={this.handleValue}
					/>
					<BasicInput
						label={'Nom'}
						inputName={'lastName'}
						value={this.state.lastName}
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
					<BasicInput
						label={'Email'}
						inputName={'email'}
						value={this.state.email}
						type="text"
						change={this.handleValue}
					/>

					{/* TEAMS */}
					{this.state.companyTeams && this.renderCompanyTeamsAssociationForm()}
				</form>
				{this.renderUserThemes()}
			</>
		);
	}

	async componentDidMount() {
		const {idCompany, idUser} = this.props.match.params;
		let user: UserDto = {} as UserDto;
		let userThemes: UserThemeDto[] = [];
		if (idUser) {
			user = await HttpRequester.getHttp(`${USER_CTRL}/${idUser}`);
			userThemes = await HttpRequester.getHttp(`${USER_THEME_SCR_CTRL}/user/${idUser}`);
		}
		const company: CompanyDto = await HttpRequester.getHttp(`${COMPANY_CTRL}/${idCompany}`);
		this.setState({
			...user,
			userThemes,
			companyTeams: company.teams,
			companyId: idCompany,
			teamId: user.team?.id,
		});
	}
}

export default withRouter(AdminCompanyUsersForm);

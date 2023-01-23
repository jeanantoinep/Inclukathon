import * as React from 'react';
import {Component} from 'react';
import {Translation} from 'react-i18next';
import i18n from '../../i18n';
import BasicInput from '../../basics/BasicInput';
import {AdminValueHandler} from '../admin/AdminValueHandler';
import {LoggedUserDto} from '../../../server/src/user/dto/logged.user.dto';
import {hideLoader, showLoader} from '../../index';
import {SaveUserDto} from '../../../server/src/user/dto/save.user.dto';
import {HttpRequester} from '../../utils/HttpRequester';
import {CONNECT_LOGIN_ENDPOINT, LOGIN_CTRL, USER_CTRL} from '../../../server/src/provider/routes.helper';
import LoginPage from '../LoginPage';
import {UserDto} from '../../../server/src/user/dto/user.dto';
import {inclucardQuestionsPath, incluscoreThemesPath} from '../../routes/incluscoreAppRoutes';
import {TeamArborescenceDto} from '../../../server/src/company/dto/teamArborescence.dto';
import {CompanyDto} from '../../../server/src/company/dto/company.dto';
import {AnalyticsUtils} from '../../utils/AnalyticsUtils';

interface TeamAndTeamArborescenceCommon {
	id: string;
	name: string;
	isTeamArborescence: boolean; // team to select for user or team arborescence to get to another level
}

interface IState {
	user: LoggedUserDto;
	newUserEmail: string;
	newFirstName: string;
	newLastName: string;
	newStudentNumber: string | undefined;
	newUserPwd: string;
	newUserTeam: string | null;
	newUserRegion: string | null;
	subscriptionType: 'sign-in' | 'sign-up';
	loginError: boolean;
	loggedUserUnwanted: boolean;
	errorReason: string;
	selectedLevel1: TeamAndTeamArborescenceCommon;
	selectedLevel2: TeamAndTeamArborescenceCommon;
	selectedLevel3: TeamAndTeamArborescenceCommon;
}

interface IProps {
	company: CompanyDto;
	isIncluCard?: boolean;
	displayStudentNumber?: boolean;
	incluscoreAppGoTo?: (pathname: string, additionalSearch?: string, refresh?: boolean) => void;
	defaultTeamId: string;
	isWebinar?: boolean;
}

class AppLoginIn extends Component<IProps, IState> {
	teams = this.props.company.teams;
	adminValueHandler = new AdminValueHandler(this);
	analyticsUtils = new AnalyticsUtils(this);
	handleSubmit = () => ({});
	noArborescenceSelected = {
		id: '-1',
		name: i18n.t('form.entity.selectPlaceholder', {ns: 'incluscore'}),
		isTeamArborescence: true,
	};
	noRegionSelected = {
		id: '-1',
		name: i18n.t('form.region.selectPlaceholder', {ns: 'incluscore'}),
	};

	constructor(props) {
		super(props);
		this.state = {
			user: window.connectedUser,
			newFirstName: '',
			newLastName: '',
			newStudentNumber: undefined,
			newUserEmail: '',
			newUserPwd: '',
			newUserTeam: this.teams?.length > 1 ? null : this.props.defaultTeamId,
			newUserRegion: null,
			subscriptionType: 'sign-up',
			loginError: false,
			loggedUserUnwanted: false,
			errorReason: '',
			selectedLevel1: this.noArborescenceSelected,
			selectedLevel2: this.noArborescenceSelected,
			selectedLevel3: this.noArborescenceSelected,
		};
	}

	setSubscriptionType = (subscriptionType: 'sign-in' | 'sign-up') => {
		this.setState({
			subscriptionType,
		});
	};

	isSignUp = () => {
		return this.state.subscriptionType === 'sign-up';
	};

	isValidEmail(email: string) {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	isEmailAndPwdAreValid = (value: string | boolean | null, key: string | null) => {
		const newUserEmail = key === 'newUserEmail' ? (value as string) : this.state.newUserEmail;
		const newUserPwd = key === 'newUserPwd' ? (value as string) : this.state.newUserPwd;
		const pwdValid = newUserPwd != null && newUserPwd.trim() != '' && newUserPwd.length > 4;
		const emailValid = newUserEmail.trim() != '' && this.isValidEmail(newUserEmail);
		return pwdValid && emailValid;
	};

	goToNextStep = (hideModal = false) => {
		this.analyticsUtils.track(AnalyticsUtils.SCR_USER_SIGN_UP_BEFORE_REDIRECT, {
			// incluscore: this.props?.incluscore?.name || 'unknown',
			company: this.props.company?.name || 'unknown',
			isInclucard: this.props.isIncluCard,
			signUp: this.isSignUp(),
			isWebinar: this.props.isWebinar,
		});
		if (this.props.isWebinar) {
			return window.location.reload();
		}
		if (hideModal) {
			window.$('#newUserModal').modal('hide');
		}
		return this.props.incluscoreAppGoTo(
			this.props.isIncluCard ? inclucardQuestionsPath : incluscoreThemesPath,
			null,
			true,
		);
	};

	loggedUserUnwanted = (hideModal = false) => {
		if (this.state.user && !this.state.loggedUserUnwanted) {
			this.goToNextStep(hideModal);
			return true;
		}
		return false;
	};

	postLogin = async (user?: LoggedUserDto | number) => {
		if (this.loggedUserUnwanted(true)) {
			return;
		}
		if (!user || (user as any)?.error) {
			window.$('#newUserModal').modal('show');
			// todo translate
			return this.setState({
				loginError: true,
				errorReason: (user as any)?.reason,
			}); // error
		}
		window.$('#newUserModal').modal('hide');
		LoginPage.saveUserConnectedInfos(user);
		this.setState({
			user: user as UserDto,
		});
		return this.goToNextStep(true);
	};

	subscribe = async () => {
		if (this.loggedUserUnwanted(true)) {
			return;
		}
		let user: LoggedUserDto;
		if (this.isSignUp()) {
			window.$('#newUserModal').modal('hide');
			showLoader(this.constructor.name);
			const body: SaveUserDto = {
				firstName: this.state.newFirstName,
				lastName: this.state.newLastName,
				studentNumber: this.state.newStudentNumber,
				email: this.state.newUserEmail,
				pwd: this.state.newUserPwd,
				teamId: this.state.newUserTeam,
				region: this.state.newUserRegion,
				companyId: this.props.company.id,
				createdFromIncluscore: true,
				enabled: true,
			};
			user = await HttpRequester.postHttp(USER_CTRL, body);
			hideLoader(this.constructor.name);
		} else {
			const body: SaveUserDto = {
				email: this.state.newUserEmail,
				pwd: this.state.newUserPwd,
			};
			user = await HttpRequester.postHttp(`${LOGIN_CTRL}/${CONNECT_LOGIN_ENDPOINT}`, body);
		}
		await this.postLogin(user);
	};

	/**
	 * Pass a key null to trigger form validation without state update
	 * @param value
	 * @param key
	 */
	isConnexionFormValid = (value: string | boolean | null, key: string | null) => {
		if (this.state.user && !this.state.loggedUserUnwanted) {
			return true;
		}
		if (!this.isSignUp()) {
			return this.isEmailAndPwdAreValid(value, key);
		}
		const newUserTeam = key === 'newUserTeam' ? value : this.state.newUserTeam;
		const newUserRegion = key === 'newUserRegion' ? value : this.state.newUserRegion;
		const newFirstName = key === 'newFirstName' ? (value as string) : this.state.newFirstName;
		const newLastName = key === 'newLastName' ? (value as string) : this.state.newLastName;
		const newStudentNumber = key === 'newStudentNumber' ? (value as string) : this.state.newStudentNumber;
		const numberStudentValid =
			!this.props.displayStudentNumber || (newStudentNumber != null && newStudentNumber.trim() != '');
		// identity
		const identityFieldsValid =
			newFirstName != null &&
			newFirstName.trim() != '' &&
			newLastName != null &&
			newLastName.trim() != '' &&
			numberStudentValid;
		const invalidRegion = this.props.company.displayRegions && newUserRegion === this.noRegionSelected.id;
		return (
			!invalidRegion &&
			newUserTeam != null &&
			this.teams.find((t) => t.id === newUserTeam) &&
			identityFieldsValid &&
			this.isEmailAndPwdAreValid(value, key)
		);
	};

	switchLoginType(isInclucard: boolean) {
		return (
			<>
				{this.isSignUp() &&
					(isInclucard ? (
						<div className={'inclucard-login-switch-container'}>
							<span>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('form.login.haveAccountAsk', {ns: 'inclucard'})}</>}
								</Translation>
							</span>{' '}
							<a
								onClick={() => {
									this.setSubscriptionType('sign-in');
								}}
							>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('form.login.signInHere', {ns: 'inclucard'})}</>}
								</Translation>
							</a>
						</div>
					) : (
						<button
							onClick={() => {
								this.setSubscriptionType('sign-in');
							}}
							type="button"
							className="btn-connect btn btn-primary c-scr-grey c-coconut-bg c-pepper-border"
						>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('form.login.signInAlreadyHaveAccount', {ns: 'incluscore'})}</>}
							</Translation>
						</button>
					))}
				{!this.isSignUp() &&
					(isInclucard ? (
						<div className={'inclucard-login-switch-container'}>
							<span>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('form.login.noAccountAsk', {ns: 'inclucard'})}</>}
								</Translation>
							</span>{' '}
							<a
								onClick={() => {
									this.setSubscriptionType('sign-up');
								}}
							>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('form.login.signUpHere', {ns: 'inclucard'})}</>}
								</Translation>
							</a>
						</div>
					) : (
						<button
							onClick={() => {
								this.setSubscriptionType('sign-up');
							}}
							type="button"
							className="btn-connect btn btn-primary c-scr-grey c-coconut-bg c-pepper-border"
						>
							<Translation ns={['translation', 'inclucard']}>
								{(t) => <>{t('form.login.signUpHere', {ns: 'inclucard'})}</>}
							</Translation>
						</button>
					))}
			</>
		);
	}

	getTeamsToDisplay = (level: number): TeamAndTeamArborescenceCommon[] => {
		return this.teams
			.filter((t) => {
				return (
					t[`level${level}`]?.id == null &&
					(level === 1 ||
						(level === 2 && t.level1?.id === this.state.selectedLevel1.id) ||
						(level === 3 &&
							t.level1?.id === this.state.selectedLevel1.id &&
							t.level2?.id === this.state.selectedLevel2.id))
				);
			})
			.map(
				(team) => ({id: team.id, name: team.name, isTeamArborescence: false} as TeamAndTeamArborescenceCommon),
			);
	};

	getTeamArborescenceAndTeamWithSameLevelToShow(
		arborescencesDto: TeamArborescenceDto[],
		level: number,
	): TeamAndTeamArborescenceCommon[] {
		const teamOnSameLevel = this.getTeamsToDisplay(level);
		const hasTeamOnSameLevel: boolean = teamOnSameLevel && teamOnSameLevel.length > 0;
		let sameLevelArborescence = [];
		if (arborescencesDto && arborescencesDto.length > 0) {
			sameLevelArborescence = arborescencesDto.filter((ta) => ta.level === level);
		}
		if ((!sameLevelArborescence || sameLevelArborescence.length < 1) && !hasTeamOnSameLevel) {
			// On this level, no arborescence and no teams to display
			return;
		}
		if (level === 2) {
			sameLevelArborescence = sameLevelArborescence.filter(
				(ta) =>
					this.teams.find((t) => {
						return t.level1?.id === this.state.selectedLevel1.id && t.level2?.id === ta.id;
					}) !== undefined,
			);
		}
		if (level === 3) {
			sameLevelArborescence = sameLevelArborescence.filter(
				(ta) =>
					this.teams.find((t) => {
						return (
							t.level1?.id === this.state.selectedLevel1.id &&
							t.level2?.id === this.state.selectedLevel2.id &&
							t.level3?.id === ta.id
						);
					}) !== undefined,
			);
		}
		return [this.noArborescenceSelected] // default
			.concat(
				sameLevelArborescence.map(
					(ta) => ({id: ta.id, name: ta.name, isTeamArborescence: true} as TeamAndTeamArborescenceCommon),
				),
			) // levels
			.concat(teamOnSameLevel); // team
	}

	renderTeamArborescence(level: number) {
		if (level > 1 && !this.state[`selectedLevel${level - 1}`]?.isTeamArborescence) {
			return null;
		}
		return (
			<div className={'form-group'}>
				<p className={'c-coconut pointer text-bold form-check-label mb-2'}>
					<Translation ns={['translation', 'incluscore']}>
						{(t) => <>{t('form.entity.label', {ns: 'incluscore'})}</>}
					</Translation>{' '}
					{level}
				</p>
				<select
					id={`level${level}`}
					className={'custom-select form-control-lg rounded-lg'}
					value={this.state[`selectedLevel${level}`]?.id}
					onChange={(e) => this.selectTeamArborescence(e, level)}
				>
					{this.getTeamArborescenceAndTeamWithSameLevelToShow(
						this.props.company.teamArborescence,
						level,
					)?.map((ta, index) => (
						<option
							key={`level${level}-${index}`}
							value={`${ta?.id}`}
							data-selected-value={this.state[`selectedLevel${level}`].id}
						>
							{ta?.name}
						</option>
					))}
				</select>
			</div>
		);
	}

	cantShowAnyArborescence() {
		return !this.canRenderLevelTeamInput(1) && !this.canRenderLevelTeamInput(2) && !this.canRenderLevelTeamInput(3);
	}

	canRenderLevelTeamInput(level: number) {
		if (level === 4 && this.cantShowAnyArborescence()) {
			return true;
		}
		if (
			(level > 1 && !this.state[`selectedLevel${level - 1}`]?.isTeamArborescence) ||
			(level > 1 && !this.canRenderLevelTeamInput(level - 1))
		) {
			return false;
		}
		let result = true;
		Array.from({length: 3}, (_, i) => i + 1).map((n) => {
			if (level != 4) {
				// level 4 is team, not teamArborescence
				let currentLevelEmpty = !this.props.company.teamArborescence?.find((ta) => ta.level === level);
				currentLevelEmpty =
					currentLevelEmpty &&
					!this.props.company.teams.find((t) => {
						return t[`level${level - 1}`] && !t[`level${level}`];
					});
				if (currentLevelEmpty) {
					result = false;
					return;
				}
			}
			if (level > n) {
				const blockedByPreviousLevel =
					this.state[`selectedLevel${n}`].id === '-1' &&
					this.props.company.teamArborescence?.find((ta) => ta.level === n);
				if (blockedByPreviousLevel) {
					result = false;
					return;
				}
			}
		});
		return result;
	}

	selectNewUserTeam = (e) => {
		this.setState({
			newUserTeam: (e.target as HTMLSelectElement).value,
		});
	};

	selectNewUserRegion = (e) => {
		this.setState({
			newUserRegion: (e.target as HTMLSelectElement).value,
		});
	};

	selectTeamArborescence = (e, level: number) => {
		const taId = (e.target as HTMLSelectElement).value;
		const update = {};
		const updateKey = `selectedLevel${level}`;
		if (taId === '-1') {
			update[updateKey] = this.noArborescenceSelected;
		} else if (this.props.company.teamArborescence.find((ta) => ta.id === taId)) {
			update[updateKey] = {
				...this.props.company.teamArborescence.find((ta) => ta.id === taId),
				isTeamArborescence: true,
			};
		} else if (this.teams.find((t) => t.id === taId)) {
			update[updateKey] = this.teams.find((t) => t.id === taId);
		}
		Array.from({length: 3}, (_, i) => i + 1).map((n) => {
			if (n > level) {
				const updateKeyTmp = `selectedLevel${n}`;
				update[updateKeyTmp] = this.noArborescenceSelected;
			}
		});
		this.setState(update);
		this.selectNewUserTeam(e);
	};

	renderSubscriptionInputs() {
		const pwdInputLabel =
			this.state.subscriptionType && this.isSignUp()
				? i18n.t('form.new-pwd.label', {ns: 'incluscore'})
				: i18n.t('form.pwd.label', {ns: 'incluscore'});
		return (
			<>
				{this.isSignUp() && (
					<>
						<BasicInput
							value={this.state.newFirstName}
							label={i18n.t('form.firstname.label', {ns: 'incluscore'})}
							inputName={'newFirstName'}
							type={'text'}
							change={this.adminValueHandler.handleValue}
						/>
						<BasicInput
							value={this.state.newLastName}
							label={i18n.t('form.lastname.label', {ns: 'incluscore'})}
							inputName={'newLastName'}
							type={'text'}
							change={this.adminValueHandler.handleValue}
						/>
						{this.props.displayStudentNumber && (
							<BasicInput
								value={this.state.newStudentNumber}
								label={i18n.t('form.studentNumber.label', {ns: 'incluscore'})}
								inputName={'newStudentNumber'}
								type={'text'}
								change={this.adminValueHandler.handleValue}
							/>
						)}
						{this.props.company.displayRegions && (
							<div className={'form-group'}>
								<p className={'c-coconut pointer text-bold form-check-label mb-2'}>
									<Translation ns={['translation', 'incluscore']}>
										{(t) => <>{t('form.region.label', {ns: 'incluscore'})}</>}
									</Translation>
								</p>
								<select
									className={'custom-select form-control-lg rounded-lg'}
									onChange={this.selectNewUserRegion}
								>
									{[this.noRegionSelected] // default
										.concat(this.props.company.availableRegions)
										.map((region) => (
											<option key={region.id} value={region.id}>
												{region.name}
											</option>
										))}
								</select>
							</div>
						)}
						{this.canRenderLevelTeamInput(1) && this.renderTeamArborescence(1)}
						{this.canRenderLevelTeamInput(2) && this.renderTeamArborescence(2)}
						{this.canRenderLevelTeamInput(3) && this.renderTeamArborescence(3)}
						{this.canRenderLevelTeamInput(4) &&
							this.teams?.length > 1 &&
							this.teams.filter(
								(t) =>
									(t.level1?.id == this.state.selectedLevel1.id &&
										t.level2?.id == this.state.selectedLevel2.id &&
										t.level3?.id == this.state.selectedLevel3.id) ||
									this.cantShowAnyArborescence(),
							).length > 1 && (
								<div className={'form-group'}>
									<p className={'c-coconut pointer text-bold form-check-label mb-2'}>
										<Translation ns={['translation', 'incluscore']}>
											{(t) => <>{t('form.entity.label', {ns: 'incluscore'})}</>}
										</Translation>{' '}
										{this.cantShowAnyArborescence() ? '' : '4'}
									</p>
									<select
										className={'custom-select form-control-lg rounded-lg'}
										onChange={this.selectNewUserTeam}
									>
										{[this.noArborescenceSelected] // default
											.concat(
												this.teams
													.filter(
														(t) =>
															(t.level1?.id == this.state.selectedLevel1.id &&
																t.level2?.id == this.state.selectedLevel2.id &&
																t.level3?.id == this.state.selectedLevel3.id) ||
															!this.props.company.teamArborescence?.length,
													)
													.map(
														(ta) =>
															({
																id: ta.id,
																name: ta.name,
																isTeamArborescence: false,
															} as TeamAndTeamArborescenceCommon),
													),
											)
											.map((team) => (
												<option key={team.id} value={team.id}>
													{team.name}
												</option>
											))}
									</select>
								</div>
							)}
					</>
				)}
				<BasicInput
					value={this.state.newUserEmail}
					label={i18n.t('form.email.label', {ns: 'incluscore'})}
					inputName={'newUserEmail'}
					type={'email'}
					change={this.adminValueHandler.handleValue}
				/>
				<BasicInput
					key={pwdInputLabel} // mandatory to trigger label change
					value={this.state.newUserPwd}
					label={pwdInputLabel}
					inputName={'newUserPwd'}
					type={'password'}
					change={this.adminValueHandler.handleValue}
				/>
				{this.state.loginError && (
					<p className={'c-warning-bg c-coconut warning-box'}>{this.state.errorReason}</p>
				)}
				{this.props.isIncluCard && this.switchLoginType(this.props.isIncluCard)}
			</>
		);
	}

	render() {
		const isInclucard = this.props.isIncluCard;
		let title, connectBtnLabel;
		title = i18n.t('form.login.enterEmail', {ns: 'incluscore'});
		connectBtnLabel = i18n.t('form.login.play', {ns: 'incluscore'});
		if (isInclucard) {
			title = i18n.t('form.login.title', {ns: 'inclucard'});
			connectBtnLabel = i18n.t('home.title', {ns: 'inclucard'});
		}
		const displayAlreadyLoggedForm = this.state.user && !this.state.loggedUserUnwanted;
		return (
			<div>
				<div className="modal-header">
					<h4 className="modal-title c-coconut"> {title} </h4>
					{!isInclucard && !displayAlreadyLoggedForm && this.switchLoginType(isInclucard)}
				</div>
				<div className="modal-body">
					{this.state.user && !this.state.loggedUserUnwanted ? (
						<>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('form.login.signInWithThatEmail', {ns: 'incluscore'})}</>}
							</Translation>{' '}
							<span className={'already-logged-email'}>{this.state.user.email}</span>
						</>
					) : (
						this.renderSubscriptionInputs()
					)}
				</div>
				<div className="modal-footer">
					<button
						onClick={() => this.subscribe()}
						disabled={!this.isConnexionFormValid(null, null)}
						type="button"
						className="btn-connect btn btn-primary c-scr-grey c-coconut-bg c-pepper-border d-block"
					>
						{connectBtnLabel}
					</button>
					{this.state.user && !this.state.loggedUserUnwanted && (
						<button
							onClick={() => this.setState({loggedUserUnwanted: true})}
							type="button"
							className="btn-connect btn btn-primary c-scr-grey c-coconut-bg c-pepper-border d-block"
						>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('form.login.signInWithOtherAccount', {ns: 'incluscore'})}</>}
							</Translation>
						</button>
					)}
				</div>
			</div>
		);
	}
}
export default AppLoginIn;

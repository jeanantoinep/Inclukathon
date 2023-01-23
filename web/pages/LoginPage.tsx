import * as React from 'react';
import Page from './Page';
import './LoginPage.scss';
import {withRouter} from 'react-router-dom';
import {HttpRequester} from '../utils/HttpRequester';
import {UserDto} from '../../server/src/user/dto/user.dto';
import {LoggedUserDto} from '../../server/src/user/dto/logged.user.dto';
import {incluscoreHomePath, incluscoreLoginPath} from '../routes/incluscoreAppRoutes';
import {
	CONNECT_LOGIN_ENDPOINT,
	HAS_A_CHOSEN_PASSWORD_ENDPOINT,
	LOGIN_CTRL,
	USER_CTRL,
} from '../../server/src/provider/routes.helper';
import {accountPath} from '../routes/inProgressInclukathonAppRoutes';
import * as Sentry from '@sentry/react';
import {initSegmentAnalyticsUser, isProd, transformUserForTierceApi} from '../index';
import i18n from '../i18n';
import {INCLU_LANG_CHOSEN_KEY} from '../App';

enum LoginStep {
	ENTER_EMAIL,
	ENTER_NEW_PWD,
	ENTER_PWD,
}

interface ILoginState {
	email: string;
	pwd: string;
	serverError: null | number;
	confirmNewPwd: string;
	loginStep: LoginStep;
	frontError: null | string;
}

type ILoginProps = IRouterProps;

class LoginPage extends Page<ILoginProps, ILoginState> {
	isIncluscoreLoginPage = () => this.props.history.location.pathname.includes(incluscoreLoginPath);

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			pwd: '',
			serverError: null,
			confirmNewPwd: '',
			loginStep: LoginStep.ENTER_EMAIL,
			frontError: null,
		};
	}

	handleEmail = async (event) => {
		const email = event.target.value;
		this.setState({email, frontError: null});
	};

	handlePwd = (event) => {
		this.setState({pwd: event.target.value, frontError: null});
	};

	handleConfirmNewPwd = (event) => {
		this.setState({confirmNewPwd: event.target.value, frontError: null});
	};

	sendCredentials = async (e) => {
		e.preventDefault();
		if (this.state.loginStep === LoginStep.ENTER_NEW_PWD && this.state.pwd !== this.state.confirmNewPwd) {
			this.setState({frontError: 'Les mots de passe ne sont pas identiques'});
			return;
		}
		const response: {error: boolean; reason: string} | UserDto = await HttpRequester.postHttp(
			`${LOGIN_CTRL}/${CONNECT_LOGIN_ENDPOINT}`,
			{
				email: this.state.email,
				pwd: this.state.pwd,
			},
		);
		this.setState({
			serverError: (response as any).error ? (response as any).reason || 0 : null,
		});
		if (!(response as any).error) {
			LoginPage.saveUserConnectedInfos(response as LoggedUserDto, true, this.isIncluscoreLoginPage());
		}
	};

	public static logout() {
		localStorage.setItem('login-token', null);
		localStorage.setItem('user-id', null);
		window.connectedUser = undefined;
		if (isProd) {
			Sentry.setUser({context: 'inclukathon-anonymous-user'});
		}
	}

	public static isConnected() {
		const userId = localStorage.getItem('user-id');
		const token = localStorage.getItem('login-token');
		return window.connectedUser && window.connectedUser.id === userId && token && token.trim() != '';
	}

	public static saveUserConnectedInfos(user: LoggedUserDto, redirection?, isIncluscoreLoginPage?) {
		localStorage.setItem('login-token', user.token);
		localStorage.setItem('user-id', user.id);
		window.connectedUser = user;
		if (isProd) {
			Sentry.setUser({
				...transformUserForTierceApi(user),
			});
			initSegmentAnalyticsUser();
		}
		if (!redirection) {
			return;
		}
		if (isIncluscoreLoginPage) {
			return (window.location.href = incluscoreHomePath);
		}
		window.location.href = accountPath;
	}

	isValidEmail() {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(this.state.email).toLowerCase());
	}

	isValidPassword(pwd) {
		return pwd?.length > 5;
	}

	renderNewPasswordInputsForm() {
		return (
			<div>
				<div className="form-group">
					<label htmlFor="password">Nouveau mot de passe</label>
					<input
						className={`
							form-control
							form-control-lg
							round-lg
							${this.isValidPassword(this.state.pwd) ? 'is-valid' : ''}
						`}
						required
						type="password"
						id="password"
						name={'password'}
						autoComplete={'current-password'}
						placeholder="Mot de passe"
						value={this.state.pwd}
						onChange={this.handlePwd}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Confirmez votre mot de passe</label>
					<input
						className={`
							form-control
							form-control-lg
							round-lg
							${this.isValidPassword(this.state.confirmNewPwd) ? 'is-valid' : ''}
						`}
						required
						type="password"
						id="password"
						name={'password'}
						autoComplete={'current-password'}
						placeholder="Mot de passe"
						value={this.state.confirmNewPwd}
						onChange={this.handleConfirmNewPwd}
					/>
				</div>
			</div>
		);
	}

	renderPwdInputForm() {
		return (
			<div className="form-group">
				<label htmlFor="password">Mot de passe</label>
				<input
					className={`
						form-control
						form-control-lg
						round-lg
						${this.isValidPassword(this.state.pwd) ? 'is-valid' : ''}
					`}
					required
					type="password"
					id="password"
					name={'password'}
					autoComplete={'current-password'}
					placeholder="Mot de passe"
					value={this.state.pwd}
					onChange={this.handlePwd}
				/>
			</div>
		);
	}

	render(): JSX.Element {
		return (
			<div>
				<form className={'login-form'} onSubmit={(e) => e.preventDefault()}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							className={`
                                form-control
                                form-control-lg
                                round-lg
                                ${this.isValidEmail() ? 'is-valid' : ''}
                            `}
							required
							disabled={this.state.loginStep !== LoginStep.ENTER_EMAIL}
							type="email"
							id="email"
							name={'email'}
							autoComplete={'email'}
							placeholder="Email"
							value={this.state.email}
							onChange={this.handleEmail}
						/>
					</div>
					{this.state.loginStep === LoginStep.ENTER_NEW_PWD && this.renderNewPasswordInputsForm()}
					{this.state.loginStep === LoginStep.ENTER_PWD && this.renderPwdInputForm()}
					{this.state.serverError != null && (
						<div className="alert alert-primary" role="alert">
							{this.state.serverError === 0 && 'Une erreur est survenue'}
							{this.state.serverError}
						</div>
					)}
					{this.state.frontError !== null && (
						<div className="alert alert-primary" role="alert">
							{this.state.frontError}
						</div>
					)}
					{this.state.loginStep === LoginStep.ENTER_EMAIL ? (
						<button
							onClick={async () => {
								const userHasAChosenPwd = await HttpRequester.getHttp(
									`${USER_CTRL}/${HAS_A_CHOSEN_PASSWORD_ENDPOINT}/${this.state.email}`,
								);
								if (!userHasAChosenPwd) {
									this.setState({frontError: 'Aucun utilisateur ne correspond à cette email'});
									return;
								}
								const loginStep = userHasAChosenPwd.hasAPassword
									? LoginStep.ENTER_PWD
									: LoginStep.ENTER_NEW_PWD;
								this.setState({loginStep});
							}}
							type={'submit'}
							className="btn btn-primary btn-all-colors w-100"
						>
							Suivant
						</button>
					) : (
						<div className={'d-flex justify-content-between align-items-center'} style={{gap: '1rem'}}>
							<button
								onClick={() => this.setState({loginStep: LoginStep.ENTER_EMAIL})}
								type={'submit'}
								className="btn btn-primary btn-all-colors button-back w-100"
							>
								Retour
							</button>
							<button
								onClick={this.sendCredentials}
								type={'submit'}
								className="btn btn-primary btn-all-colors w-100"
							>
								Se connecter
							</button>
						</div>
					)}
				</form>
			</div>
		);
	}
}

export default withRouter(LoginPage);

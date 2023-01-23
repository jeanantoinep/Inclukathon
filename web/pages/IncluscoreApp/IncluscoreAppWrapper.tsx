import * as React from 'react';
import {Component} from 'react';
import LoginPage from '../LoginPage';
import {hideLoader, showLoader} from '../../index';
import {withRouter} from 'react-router-dom';
import {HttpRequester} from '../../utils/HttpRequester';
import {LaunchIncluscoreDto} from '../../../server/src/incluscore/dto/launch.incluscore.dto';
import {IncluscoreDto} from '../../../server/src/incluscore/dto/incluscore.dto';
import {CompanyDto} from '../../../server/src/company/dto/company.dto';
import {
	inclucardAppPath,
	incluscoreAppPath,
	incluscoreHomePath,
	incluscoreLoginPath,
	incluscoreThemesPath,
} from '../../routes/incluscoreAppRoutes';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {LAUNCH_SCR_CTRL, USER_CTRL} from '../../../server/src/provider/routes.helper';
import * as Sentry from '@sentry/react';
import './CommonIncluscoreStyle.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {ToastHelper} from '../../basics/ToastHelper';
import {UserThemeDto} from '../../../server/src/incluscore/dto/user-theme.dto';
import {Translation} from 'react-i18next';
import {AnalyticsUtils} from '../../utils/AnalyticsUtils';
library.add(faXmark as any);

interface IIncluscoreAppWrapperState {
	incluscore: IncluscoreDto;
	company: CompanyDto;
	launch: LaunchIncluscoreDto;
	showNps: boolean;
	npsComment: string;
	npsNotation: number;
}

interface IProps extends IRouterProps {
	isErrorPage: boolean;
}

class IncluscoreAppWrapper extends Component<IProps, IIncluscoreAppWrapperState> {
	public static readonly CURRENT_ID_LAUNCH_LOCAL_STORAGE_KEY = 'id-launch-scr';
	analyticsUtils = new AnalyticsUtils(this);

	constructor(props) {
		super(props);
		this.state = {
			incluscore: null,
			company: null,
			launch: null,
			showNps: false,
			npsComment: window.connectedUser ? window.connectedUser.npsComment : '',
			npsNotation: window.connectedUser ? window.connectedUser.npsNotation : null,
		};
	}

	showNpsWhenUserIsReady = (launch = this.state.launch) => {
		const userTheme: UserThemeDto = launch?.userThemes?.find(
			(ut: UserThemeDto) => ut?.userId?.id === window.connectedUser?.id,
		);
		return userTheme?.answers?.length > 0;
	};

	async retrieveIncluscoreByIds(idLaunch: string) {
		if (this.props.isErrorPage) {
			return null;
		}
		showLoader(this.constructor.name);
		window.localStorage.setItem(IncluscoreAppWrapper.CURRENT_ID_LAUNCH_LOCAL_STORAGE_KEY, idLaunch);
		const launch: LaunchIncluscoreDto = await HttpRequester.getHttp(`${LAUNCH_SCR_CTRL}/${idLaunch}`);
		if (this.props.location.pathname === incluscoreHomePath) {
			this.analyticsUtils.track(AnalyticsUtils.SCR_HOMEPAGE_SEEN, {
				incluscore: launch?.idIncluscore?.name || 'unknown',
				company: launch?.idCompany?.name || 'unknown',
			});
		}
		if (!launch) {
			hideLoader(this.constructor.name);
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			Sentry.captureMessage(
				`Redirecting user to /not-found, unable to find which incluscore have to be retrieved. From localstorage: ${window.localStorage.getItem(
					IncluscoreAppWrapper.CURRENT_ID_LAUNCH_LOCAL_STORAGE_KEY,
				)}. From url: ${urlParams.get('i')}, url before redirection: ${
					window.location.href
				}, launch id used in http req: ${idLaunch}`,
			);
			return this.incluscoreAppGoTo(incluscoreAppPath + '/not-found');
		}
		if (!launch.idIncluscore.canBePublic || this.props.location.pathname !== incluscoreHomePath) {
			this.redirectToLoginPageIfNotConnected(launch.idIncluscore.canBePublic);
		}
		this.setState({
			incluscore: launch.idIncluscore,
			company: launch.idCompany,
			launch: launch,
			showNps: this.showNpsWhenUserIsReady(launch),
		});
		hideLoader(this.constructor.name);
		if (launch.idIncluscore.isInclucard && !this.props.history.location.pathname.includes(inclucardAppPath)) {
			return this.incluscoreAppGoTo(inclucardAppPath + '/home');
		}
	}

	redirectToLoginPageIfNotConnected(canBePublic) {
		if (!LoginPage.isConnected()) {
			hideLoader(this.constructor.name);
			// redirect to home to connect user
			window.location.href = canBePublic
				? incluscoreHomePath + location.search
				: incluscoreLoginPath + location.search;
			return true;
		}
		return false;
	}

	incluscoreAppGoTo = (pathname: string, additionalSearch?: string, refresh?: boolean) => {
		if (refresh) {
			return (window.location.href = pathname + window.location.search);
		}
		this.props.history.push({
			pathname,
			state: this.state,
			search: window.location.search,
		});
	};

	setContext = () => {
		document.title = 'Incluscore';
		if (this.state.incluscore && this.state.incluscore.isInclucard) {
			const root = document.documentElement;
			root.style.setProperty('--inclucard-main-color', this.state.incluscore.inclucardColor);
			document.title = 'IncluCard';
			document.querySelector('.incluscore-app-wrapper').classList.add('h-100');
		} else if (this.state.incluscore) {
			const root = document.documentElement;
			root.style.setProperty('--incluscore-main-color', '#4C4F50');
			root.style.setProperty('--incluscore-second-color', '#4C4F50');
			if (this.state.incluscore.incluscoreColor) {
				root.style.setProperty('--incluscore-main-color', this.state.incluscore.incluscoreColor);
				root.style.setProperty('--incluscore-second-color', this.state.incluscore.incluscoreColor);
			}
			if (this.state.incluscore.secondIncluscoreColor) {
				root.style.setProperty('--incluscore-second-color', this.state.incluscore.secondIncluscoreColor);
			}
		}
	};

	getIdLaunch = () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		// todo remove urlParams.get('id-launch') after some releases
		const idLaunch =
			urlParams.get('id-launch') ||
			urlParams.get('i') ||
			window.localStorage.getItem(IncluscoreAppWrapper.CURRENT_ID_LAUNCH_LOCAL_STORAGE_KEY);
		return idLaunch || null;
	};

	sendNpsNotation = async (npsNotation: number) => {
		this.setState({
			npsNotation,
		});
		await HttpRequester.postHttp(USER_CTRL + '/nps', {
			step: 1,
			notation: npsNotation,
		});
	};

	sendNpsComment = async () => {
		this.setState({
			showNps: false,
		});
		window.localStorage.setItem('dont-show-nps-' + window.connectedUser.id, 'true');
		ToastHelper.showIncluscoreMsg(`Merci pour votre retour d'expérience !`);
		await HttpRequester.postHttp(USER_CTRL + '/nps', {
			step: 2,
			comment: this.state.npsComment,
		});
	};

	renderNps() {
		if (
			!this.state.showNps ||
			!window.connectedUser?.id ||
			window.localStorage.getItem('dont-show-nps-' + window.connectedUser.id) ||
			window.connectedUser?.npsComment
		) {
			return null;
		}
		const themesPage = window.location.pathname.includes(incluscoreThemesPath);
		return (
			<div className={`nps-container ${themesPage ? 'animate__animated animate__fadeInBottomRight' : ''}`}>
				<div className={'d-flex justify-content-between'}>
					{this.state.npsNotation != null ? (
						<p className={'nps-ask'}>
							{this.state.npsNotation < 7 ? (
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('nps.whyXpWasBad', {ns: 'incluscore'})}</>}
								</Translation>
							) : (
								<>
									{this.state.npsNotation < 9 && (
										<Translation ns={['translation', 'incluscore']}>
											{(t) => <>{t('nps.whyXpWasMedium', {ns: 'incluscore'})}</>}
										</Translation>
									)}
									{this.state.npsNotation > 8 && (
										<Translation ns={['translation', 'incluscore']}>
											{(t) => <>{t('nps.whyXpWasGood', {ns: 'incluscore'})}</>}
										</Translation>
									)}
								</>
							)}
						</p>
					) : (
						<p className={'nps-ask'}>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('nps.notationTitle', {ns: 'incluscore'})}</>}
							</Translation>
						</p>
					)}

					<FontAwesomeIcon
						onClick={() => {
							window.localStorage.setItem('dont-show-nps-' + window.connectedUser.id, 'true');
							this.setState({showNps: false});
						}}
						className={'c-coconut pointer'}
						icon={['fas', 'xmark']}
					/>
				</div>

				{this.state.npsNotation != null ? (
					<div>
						<textarea
							className={'w-100'}
							id={'nps'}
							name={'nps'}
							value={this.state.npsComment}
							onChange={(e) =>
								this.setState({
									npsComment: e.target.value,
								})
							}
						/>
						<button
							className={'btn btn-secondary ml-auto mr-0 d-block'}
							onClick={() => this.sendNpsComment()}
						>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('nps.confirm', {ns: 'incluscore'})}</>}
							</Translation>
						</button>
					</div>
				) : (
					<div className={'d-flex'}>
						{Array.from({length: 10}, (_, i) => i + 1).map((i) => {
							return (
								<div
									key={i}
									className={'nps-single-note'}
									onClick={async () => {
										await this.sendNpsNotation(i);
									}}
								>
									{i}
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	}

	render() {
		const child: any = this.props.children;
		this.setContext();
		return (
			<div className={'incluscore-app-wrapper'}>
				{(this.state.incluscore || this.props.isErrorPage) &&
					React.cloneElement(child, {
						incluscore: this.state.incluscore,
						company: this.state.company,
						launch: this.state.launch,
						incluscoreAppGoTo: this.incluscoreAppGoTo,
						history: this.props.history,
					} as IncluscoreWrappedComponentProps)}
				{this.renderNps()}
			</div>
		);
	}

	componentDidUpdate() {
		if (!this.state?.incluscore) {
			return;
		}
		const {isInclucard} = this.state?.incluscore;
		const hasBg = document.querySelector('body').classList.contains('inclucard-background');
		if (isInclucard && !hasBg) {
			document.querySelector('body').classList.add('inclucard-background');
		}
	}

	async componentDidMount() {
		const idLaunch = this.getIdLaunch();
		if (idLaunch) {
			await this.retrieveIncluscoreByIds(idLaunch);
			return;
		}
		if (!this.props.isErrorPage) {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			Sentry.captureMessage(
				`Redirecting user to /missing-parameters, unable to get launch. From localstorage: ${window.localStorage.getItem(
					IncluscoreAppWrapper.CURRENT_ID_LAUNCH_LOCAL_STORAGE_KEY,
				)}. From url: ${urlParams.get('i')}, url before redirection: ${window.location.href}`,
			);
			this.incluscoreAppGoTo(incluscoreAppPath + '/missing-parameters');
		}
	}
}

export default withRouter(IncluscoreAppWrapper);

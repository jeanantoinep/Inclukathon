import * as React from 'react';
import {withRouter} from 'react-router-dom';
import './IncluscoreAppHome.scss';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import IncluAppHeader from './layout/IncluAppHeader';
import {TextToInterpretedTextHelper} from './helpers/TextToInterpretedTextHelper';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {LoggedUserDto} from '../../../server/src/user/dto/logged.user.dto';
import {inclucardQuestionsPath, incluscoreAnswersPath, incluscoreThemesPath} from '../../routes/incluscoreAppRoutes';
import {Translation} from 'react-i18next';
import {tr} from '../../translations/TranslationsUtils';
import {ToastHelper} from '../../basics/ToastHelper';
import i18n from '../../i18n';
import AppLoginIn from '../appSignIn/AppLoginIn';

interface IncluscoreAppHomeState {
	user: LoggedUserDto;
	endedModalHasBeenShown: boolean;
}

class IncluscoreAppHome extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, IncluscoreAppHomeState> {
	teams = this.props.company.teams;

	constructor(props) {
		super(props);
		this.state = {
			user: window.connectedUser,
			endedModalHasBeenShown: false,
		};
	}

	beginBtnClicked = () => {
		if (!this.state.user) {
			return window.$('#newUserModal').modal();
		}
		return this.goToNextStep();
	};

	goToNextStep = (hideModal = false) => {
		if (hideModal) {
			window.$('#newUserModal').modal('hide');
		}
		const isInclucard = this.props.incluscore.isInclucard;
		return this.props.incluscoreAppGoTo(isInclucard ? inclucardQuestionsPath : incluscoreThemesPath, null, true);
	};

	subscriptionModal() {
		if (this.state.user) {
			return null;
		}
		return (
			<div id={'newUserModal'} className="modal" tabIndex={-1} role="dialog">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content c-scr-grey-bg c-coconut">
						<AppLoginIn
							company={this.props.company}
							incluscoreAppGoTo={this.props.incluscoreAppGoTo}
							isIncluCard={this.props.incluscore.isInclucard}
							displayStudentNumber={this.props.incluscore.displayNewStudentNumber}
							defaultTeamId={this.props.company.teams && this.props.company.teams[0].id}
						/>
					</div>
				</div>
			</div>
		);
	}

	getEndedIdTheme() {
		return this.retrieveStoredIncluscoreEnded();
	}

	removeEndedIdThemeOfUrl() {
		IncluscoreAppCommon.resetLocalStorageScr();
	}

	endedModal() {
		const idThemeEnded = this.getEndedIdTheme();
		if (!idThemeEnded) {
			return null;
		}
		/*const uniqueUsersEndedIncluscore: string[] = [];
		const usersEndedIncluscore = this.props.launch.userThemes
			?.filter((u) => u.answeredAll)
			?.map((u) => u.userId.id);
		for (const idUser of usersEndedIncluscore) {
			if (!uniqueUsersEndedIncluscore.find((uniqueIdUser) => idUser === uniqueIdUser)) {
				uniqueUsersEndedIncluscore.push(idUser);
			}
		}
		const endedThemeUserCount = uniqueUsersEndedIncluscore.length;*/
		return (
			<div id={'endedModal'} className="modal" tabIndex={-1} role="dialog">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content c-scr-grey-bg c-coconut">
						<div className="modal-header">
							<h5 className="modal-title c-coconut">
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('end.ty', {ns: 'incluscore'})}</>}
								</Translation>
							</h5>
							<button type="button" className="close c-coconut" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('end.bravo', {ns: 'incluscore'})}</>}
								</Translation>
								{/*, vous êtes la&nbsp;
								{endedThemeUserCount + (endedThemeUserCount < 2 ? 'ère' : 'ème')}
								&nbsp;personne à avoir participé à ce quiz.*/}
							</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn-connect btn btn-primary c-scr-grey c-coconut-bg c-pepper-border"
								data-dismiss="modal"
								onClick={() => this.modalBtnShowAnswers()}
							>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('end.seeAnswers', {ns: 'incluscore'})}</>}
								</Translation>
							</button>
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('end.back', {ns: 'incluscore'})}</>}
								</Translation>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	showEndedThemeModal() {
		const idThemeEnded = this.getEndedIdTheme();
		if (idThemeEnded && !this.state.endedModalHasBeenShown) {
			this.setState({endedModalHasBeenShown: true});
			const success = i18n.t('home.allThemesEnded', {ns: 'incluscore'});
			ToastHelper.showIncluscoreMsg(success);
			window.$('#endedModal').modal();
		}
	}

	modalBtnShowAnswers() {
		this.props.incluscoreAppGoTo(incluscoreAnswersPath);
	}

	dontShowModalTwice() {
		window.$('#endedModal').on('hidden.bs.modal', () => {
			this.removeEndedIdThemeOfUrl();
		});
	}

	setFullPageHeight() {
		const subNavbarContainer = document.querySelector('.pages-sub-navbar-container') as HTMLElement;
		if (subNavbarContainer) {
			subNavbarContainer.style.height = '100%';
		}
	}

	render() {
		const {incluscore, launch} = this.props;
		const isInclucard = incluscore.isInclucard;
		if (!incluscore) {
			return null;
		}
		if (isInclucard) {
			this.setFullPageHeight();
		}
		return (
			<div className={`incluscore-app home user-select-none ${isInclucard ? 'is-inclucard' : ''}`}>
				<div className={'quiz-presentation'}>
					<IncluAppHeader
						incluscore={incluscore}
						companyImgPath={this.props.company.imgPath}
						launch={launch}
					/>
					{!isInclucard && <h1 className={'align-center'}>{tr(incluscore, 'name')}</h1>}
					<p>{TextToInterpretedTextHelper.getInterpretation(tr(incluscore, 'description'))}</p>
					{isInclucard && (
						<button
							className={'btn-begin basic-btn'}
							onClick={() => {
								document.querySelector('.inclucard-connexion').classList.add('d-block');
								document.querySelector('.quiz-presentation').classList.add('d-none');
							}}
						>
							<Translation ns={['translation', 'inclucard']}>
								{(t) => <>{t('home.title', {ns: 'inclucard'})}</>}
							</Translation>
						</button>
					)}
					{!isInclucard && (
						<button className={'basic-btn'} onClick={this.beginBtnClicked}>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('home.title', {ns: 'incluscore'})}</>}
							</Translation>
						</button>
					)}
				</div>
				{isInclucard && (
					<div className={'inclucard-connexion'}>
						<AppLoginIn
							company={this.props.company}
							incluscoreAppGoTo={this.props.incluscoreAppGoTo}
							isIncluCard={this.props.incluscore.isInclucard}
							displayStudentNumber={this.props.incluscore.displayNewStudentNumber}
							defaultTeamId={this.props.company.teams && this.props.company.teams[0].id}
						/>
					</div>
				)}
				{this.endedModal()}
				{this.subscriptionModal()}
			</div>
		);
	}

	componentDidMount() {
		if (this.props.incluscore.isInclucard) {
			document.querySelector('.app-wrapper')?.classList?.add('h-100');
		}
		this.showEndedThemeModal();
		this.dontShowModalTwice();
	}
}

export default withRouter(IncluscoreAppHome);

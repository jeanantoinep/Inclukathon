import * as React from 'react';
import {Component} from 'react';
import './IncluscoreMenu.scss';
import LoginPage from '../../LoginPage';
import CssVarsHelper from '../helpers/CssVarsHelper';
import {
	inclucardAboutPath,
	inclucardHomePath,
	inclucardScorePath,
	incluscoreAboutPath,
	incluscoreAnswersPath,
	incluscoreHomePath,
	incluscoreScorePath,
	incluscoreThemesPath,
} from '../../../routes/incluscoreAppRoutes';
import {Translation} from 'react-i18next';
import IncluscoreAppCommon from '../IncluscoreAppCommon';

interface IncluscoreMenuProps {
	isInclucard?: boolean;
	goToMethod: any;
	score?: number;
}

export default class IncluscoreMenu extends Component<IncluscoreMenuProps, any> {
	homePath = this.props.isInclucard ? inclucardHomePath : incluscoreHomePath;
	scorePath = this.props.isInclucard ? inclucardScorePath : incluscoreScorePath;
	aboutPath = this.props.isInclucard ? inclucardAboutPath : incluscoreAboutPath;

	logoutAndGoHome = () => {
		IncluscoreAppCommon.resetLocalStorageScr();
		LoginPage.logout();
		return this.props.goToMethod(this.homePath);
	};

	setMenuToggleable() {
		const burgerMenu = document.querySelector('.incluscore-burger') as HTMLObjectElement;
		burgerMenu.addEventListener(
			'load',
			() => {
				const svgDoc = burgerMenu.contentDocument;
				if (!svgDoc) {
					return;
				}
				if (this.props.isInclucard && svgDoc.querySelectorAll('.cls-1, .cls-2')) {
					for (const elem of svgDoc.querySelectorAll('.cls-1, .cls-2')) {
						if (elem as HTMLElement)
							(elem as HTMLElement).style.stroke =
								CssVarsHelper.getColorFromVariableName('--inclucard-main-color');
					}
				}
				const burgerImg = svgDoc.getElementsByTagName('svg')[0] as SVGSVGElement;
				try {
					if (burgerImg) {
						burgerImg.style.cursor = 'pointer';
					}
				} catch (e) {
					console.debug(`couldn't set burger menu to pointer`);
				}
				burgerImg.addEventListener(
					'click',
					() => {
						window.$('.dropdown-toggle').dropdown('toggle');
					},
					false,
				);
			},
			false,
		);
	}

	renderScoreModalForInclucard() {
		return (
			<div id={'scoreModal'} className="modal" tabIndex={-1} role="dialog">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content c-scr-grey-bg c-coconut">
						<div className="modal-header">
							<h5 className="modal-title c-coconut">
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('score.title', {ns: 'inclucard'})}</>}
								</Translation>
							</h5>
							<button type="button" className="close c-coconut" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('score.ty-for-participation', {ns: 'inclucard'})}</>}
								</Translation>
							</p>
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('score.scoreCount', {ns: 'inclucard', score: this.props.score})}</>}
								</Translation>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderAboutModalForInclucard() {
		return (
			<div id={'aboutModal'} className="modal modal-about" tabIndex={-1} role="dialog">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content c-scr-grey-bg c-coconut">
						<div className="modal-header">
							<h5 className="modal-title c-coconut">
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.title', {ns: 'inclucard'})}</>}
								</Translation>
							</h5>
							<button type="button" className="close c-coconut" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.subtitle', {ns: 'inclucard'})}</>}
								</Translation>
							</p>
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.how', {ns: 'inclucard'})}</>}
								</Translation>
							</p>
							<h5>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.howTitle', {ns: 'inclucard'})}</>}
								</Translation>
							</h5>
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.howSubtitle', {ns: 'inclucard'})}</>}
								</Translation>
							</p>
							<h5>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.companyTitle', {ns: 'inclucard'})}</>}
								</Translation>
							</h5>
							<p className={'c-coconut'}>
								<Translation ns={['translation', 'inclucard']}>
									{(t) => <>{t('about.company', {ns: 'inclucard'})}</>}
								</Translation>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<nav className={`nav-incluscore navbar navbar-expand ${this.props.isInclucard ? 'is-inclucard' : ''}`}>
				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbar-incluscore"
					aria-controls="navbar-incluscore"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navbar-incluscore">
					{this.props.isInclucard && (
						<>
							{this.renderAboutModalForInclucard()}
							{this.renderScoreModalForInclucard()}
						</>
					)}
					<ul className="navbar-nav mr-auto">
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle incluscore"
								href="#"
								id="navbarDropdown"
								role="button"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<object
									className={'incluscore-burger pointer'}
									data={'/img/incluscore-app/purple_burger.svg'}
									type="image/svg+xml"
								/>
							</a>
							<div
								className="dropdown-menu incluscore c-coconut c-scr-grey-bg"
								aria-labelledby="navbarDropdown"
							>
								{!this.props.isInclucard && (
									<>
										<a onClick={() => this.props.goToMethod(incluscoreThemesPath)}>
											<Translation ns={['translation', 'incluscore']}>
												{(t) => <>{t('menu.themes', {ns: 'incluscore'})}</>}
											</Translation>
										</a>
										<a onClick={() => this.props.goToMethod(incluscoreAnswersPath)}>
											<Translation ns={['translation', 'incluscore']}>
												{(t) => <>{t('menu.answers', {ns: 'incluscore'})}</>}
											</Translation>
										</a>
									</>
								)}

								<a
									onClick={() =>
										this.props.isInclucard
											? window.$('#scoreModal').modal()
											: this.props.goToMethod(this.scorePath)
									}
								>
									<Translation ns={['translation', 'incluscore']}>
										{(t) => <>{t('menu.score', {ns: 'incluscore'})}</>}
									</Translation>
								</a>
								<a
									onClick={() =>
										this.props.isInclucard
											? window.$('#aboutModal').modal()
											: this.props.goToMethod(this.aboutPath)
									}
								>
									<Translation ns={['translation', 'incluscore']}>
										{(t) => <>{t('menu.about', {ns: 'incluscore'})}</>}
									</Translation>
								</a>
								<a onClick={() => this.logoutAndGoHome()}>
									<Translation ns={['translation', 'incluscore']}>
										{(t) => <>{t('menu.disconnect', {ns: 'incluscore'})}</>}
									</Translation>
								</a>
							</div>
						</li>
					</ul>
				</div>
			</nav>
		);
	}

	componentDidMount() {
		this.setMenuToggleable();
	}
}

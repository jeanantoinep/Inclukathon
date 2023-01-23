import * as React from 'react';
import {withRouter} from 'react-router-dom';
import './IncluscoreAppThemes.scss';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import IncluAppHeader from './layout/IncluAppHeader';
import {library} from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames/bind';
import IncluscoreMenu from './layout/IncluscoreMenu';
import {IncluscorePropertiesHelper} from './helpers/IncluscorePropertiesHelper';
import {TextToInterpretedTextHelper} from './helpers/TextToInterpretedTextHelper';
import {ThemeDto} from '../../../server/src/incluscore/dto/theme.dto';
import {IncluscoreDto} from '../../../server/src/incluscore/dto/incluscore.dto';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {incluscoreQuestionPath} from '../../routes/incluscoreAppRoutes';
import {tr} from '../../translations/TranslationsUtils';
import {ToastHelper} from '../../basics/ToastHelper';
import i18n from '../../i18n';
import {UserThemeDto} from '../../../server/src/incluscore/dto/user-theme.dto';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAward, faHeartCircleCheck, faStar} from '@fortawesome/free-solid-svg-icons';
import {Translation} from 'react-i18next';

library.add(faAward as any, faHeartCircleCheck as any, faStar as any);

interface IncluscoreAppThemesState {
	incluscore: IncluscoreDto;
}

class IncluscoreAppThemes extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, IncluscoreAppThemesState> {
	isLockedTheme(theme: ThemeDto): boolean {
		const userTheme = IncluscorePropertiesHelper.getUserThemeByIdThemeIdUser(this.props.launch, theme.id);
		if (userTheme) {
			return userTheme.answeredAll;
		}
		return false;
	}

	chooseTheme = (theme: ThemeDto) => {
		this.storeSelectedTheme(theme.id);
		this.props.incluscoreAppGoTo(incluscoreQuestionPath);
	};

	showIconErrorCount(theme: ThemeDto, nbError: number) {
		const userTheme: UserThemeDto | undefined = this.props.launch.userThemes?.find((u) => {
			return u && u.userId.id === window.connectedUser.id && u.themeId.id === theme.id;
		});
		if (nbError === 0) {
			return (
				userTheme?.answers?.length === theme.questions.length &&
				!userTheme.answers.find((a) => !a.userAnswer.isAGoodAnswer)
			);
		}
		return (
			userTheme?.answers?.length === theme.questions.length &&
			userTheme.answers.filter((a) => !a.userAnswer.isAGoodAnswer)?.length === nbError
		);
	}

	hasShownAtLeastOneIcon = () => {
		return this.props.incluscore?.themes?.find((t) => {
			return this.showIconErrorCount(t, 0) || this.showIconErrorCount(t, 1) || this.showIconErrorCount(t, 2);
		});
	};

	renderIconsLegend() {
		if (!this.hasShownAtLeastOneIcon()) {
			return null;
		}
		return (
			<>
				<hr className={'d-block d-lg-none'} />
				<div className={'icons-theme-legend-container'}>
					<p className={'text-center mb-1'}>
						<Translation ns={['translation', 'incluscore']}>
							{(t) => <>{t('themes.legend', {ns: 'incluscore'})}</>}
						</Translation>
					</p>
					<div className={'icons-theme-legend'}>
						<div className={'icon-legend'}>
							<div>
								<FontAwesomeIcon className={'c-scr-grey'} icon={['fas', 'heart-circle-check' as any]} />
							</div>
							<p>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('themes.perfect', {ns: 'incluscore'})}</>}
								</Translation>
							</p>
						</div>
						<div className={'icon-legend'}>
							<div>
								<FontAwesomeIcon className={'c-scr-grey'} icon={['fas', 'star']} />
							</div>
							<p>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('themes.errorCount', {ns: 'incluscore', errorCount: 1})}</>}
								</Translation>
							</p>
						</div>
						<div className={'icon-legend'}>
							<div>
								<FontAwesomeIcon className={'c-scr-grey'} icon={['fas', 'award']} />
							</div>
							<p>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('themes.errorsCount', {ns: 'incluscore', errorCount: 2})}</>}
								</Translation>
							</p>
						</div>
					</div>
				</div>
			</>
		);
	}

	render() {
		const incluscore = this.props.incluscore;
		const isInclucard = this.props.incluscore.isInclucard;
		return (
			<>
				<IncluscoreMenu isInclucard={isInclucard} goToMethod={(path) => this.props.incluscoreAppGoTo(path)} />
				<div className={'incluscore-app themes user-select-none'}>
					<IncluAppHeader
						incluscore={incluscore}
						companyImgPath={this.props.company.imgPath}
						launch={this.props.launch}
						isThemesPage={true}
					/>
					<div className={`flex-themes-container ${this.hasShownAtLeastOneIcon() ? 'mb-5' : ''}`}>
						{incluscore &&
							incluscore.themes &&
							incluscore.themes.length &&
							incluscore.themes.map((theme, index) => {
								const isLocked = this.isLockedTheme(theme);
								const themeClass = classNames('theme', {
									'is-locked': isLocked,
								});
								return (
									<div
										key={index}
										className={themeClass}
										onClick={() => (isLocked ? null : this.chooseTheme(theme))}
									>
										{isLocked && (
											<img
												draggable={false}
												className={'icon-lock'}
												src={'/img/incluscore-app/lock.svg'}
												alt={'lock'}
											/>
										)}
										{this.showIconErrorCount(theme, 0) && (
											<FontAwesomeIcon
												className={'icon-perfect'}
												icon={['fas', 'heart-circle-check' as any]}
											/>
										)}
										{this.showIconErrorCount(theme, 1) && (
											<FontAwesomeIcon className={'icon-perfect'} icon={['fas', 'star']} />
										)}
										{this.showIconErrorCount(theme, 2) && (
											<FontAwesomeIcon className={'icon-perfect'} icon={['fas', 'award']} />
										)}
										<img
											draggable={false}
											className={'theme-img'}
											src={'/themes-logo/' + theme.imgPath}
											alt={'theme-img'}
										/>
										<button className={'theme-title is-locked'}>
											<span className={'theme-title-text'}>
												{TextToInterpretedTextHelper.getInterpretation(tr(theme, 'name'))}
											</span>
										</button>
									</div>
								);
							})}
					</div>
					{this.renderIconsLegend()}
				</div>
			</>
		);
	}

	componentDidMount() {
		if (this.retrieveThemeDone()) {
			const success = i18n.t('themes.themeEnded', {ns: 'incluscore'}) + this.retrieveThemeDone();
			ToastHelper.showIncluscoreMsg(success);
		}
		window.localStorage.removeItem(IncluscoreAppCommon.SHOW_SUCCESS_ID_THEME_DONE_LS_KEY);
	}
}

export default withRouter(IncluscoreAppThemes);

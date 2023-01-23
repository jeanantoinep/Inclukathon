import * as React from 'react';
import {withRouter} from 'react-router-dom';
import './IncluscoreAppQuestions.scss';
import IncluAppHeader from './layout/IncluAppHeader';
import {IncluscorePropertiesHelper} from './helpers/IncluscorePropertiesHelper';
import Lottie from 'react-lottie';
import {TextToInterpretedTextHelper} from './helpers/TextToInterpretedTextHelper';
import IncluscoreAppCommon from './IncluscoreAppCommon';
import {SaveUserThemeDto} from '../../../server/src/incluscore/dto/creation/save.user-theme.dto';
import {ThemeDto} from '../../../server/src/incluscore/dto/theme.dto';
import {QuestionDto} from '../../../server/src/incluscore/dto/question.dto';
import {PropositionDto} from '../../../server/src/incluscore/dto/proposition.dto';
import {UserThemeDto} from '../../../server/src/incluscore/dto/user-theme.dto';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {HttpRequester} from '../../utils/HttpRequester';
import {LaunchIncluscoreDto} from '../../../server/src/incluscore/dto/launch.incluscore.dto';
import {incluscoreAppPath, incluscoreHomePath, incluscoreThemesPath} from '../../routes/incluscoreAppRoutes';
import {USER_THEME_SCR_CTRL} from '../../../server/src/provider/routes.helper';
import {hideLoader, showLoader} from '../../index';
import {tr} from '../../translations/TranslationsUtils';
import i18n from '../../i18n';
import {Translation} from 'react-i18next';
import {AnalyticsUtils} from '../../utils/AnalyticsUtils';

interface IStateQuestionScrPage {
	selectedTheme: ThemeDto;
	userTheme: UserThemeDto;
	selectedQuestion: QuestionDto;
	chosenProposition: PropositionDto;
	launch: LaunchIncluscoreDto;
}

class IncluscoreAppQuestions extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, IStateQuestionScrPage> {
	analyticsUtils = new AnalyticsUtils(this);
	RANDOM_GUY_IMG = this.updateRandomGuyImg();

	constructor(props) {
		super(props);
		this.state = {
			selectedTheme: null,
			userTheme: null,
			selectedQuestion: null,
			chosenProposition: null,
			launch: this.props.launch,
		};
	}

	initState() {
		const selectedThemeId = this.retrieveStoredSelectedTheme();
		const selectedTheme = this.props.incluscore.themes.find((theme) => theme.id === selectedThemeId);
		if (!selectedTheme) {
			return this.props.incluscoreAppGoTo(incluscoreThemesPath);
		}
		const userTheme = IncluscorePropertiesHelper.getUserThemeByIdThemeIdUser(this.state.launch, selectedTheme.id);
		if (!selectedTheme.questions || selectedTheme.questions.length < 1) {
			return this.props.incluscoreAppGoTo(incluscoreThemesPath);
		}
		const idQuestion = this.retrieveStoredSelectedQuestion();
		let selectedQuestion = idQuestion ? selectedTheme.questions.find((q) => q.id === idQuestion) : null;
		if (!selectedQuestion) {
			selectedQuestion = selectedTheme.questions[0];
		}
		const chosenProposition = this.retrievePropositionByQuestionId(userTheme, idQuestion);
		this.setState({
			selectedTheme,
			userTheme,
			selectedQuestion,
			chosenProposition,
		});
	}

	updateRandomGuyImg() {
		return 1 + Math.floor(Math.random() * Math.floor(12));
	}

	retrievePropositionByQuestionId(userTheme: UserThemeDto, idQuestion: string) {
		const answer = userTheme?.answers?.find((a) => a.questionId.id === idQuestion);
		return userTheme && answer ? answer?.userAnswer : null;
	}

	userHaveFinishAllThemes() {
		for (const t of this.props.incluscore.themes) {
			const userTheme: UserThemeDto = IncluscorePropertiesHelper.getUserThemeByIdThemeIdUser(
				this.props.launch,
				t.id,
			);
			if (!userTheme?.answeredAll) {
				return false;
			}
		}
		return true;
	}

	getAnswersExplanation = (): string => {
		const {selectedQuestion} = this.state;
		const goodPropositions = selectedQuestion.propositions.filter((p) => p.isAGoodAnswer);
		let goodAnswers = '';
		for (let i = 0; i < goodPropositions.length; i++) {
			if (goodAnswers != '') {
				goodAnswers += ', ';
			}
			goodAnswers += tr(goodPropositions[i], 'title');
		}
		return goodAnswers;
	};

	goToNextQuestion = () => {
		const {selectedTheme} = this.state;
		this.RANDOM_GUY_IMG = this.updateRandomGuyImg();
		const nextQuestionIndex = this.findIndexOfCurrentQuestion() + 1;
		if (nextQuestionIndex < selectedTheme.questions.length) {
			const nextQuestion = selectedTheme.questions[nextQuestionIndex];
			this.storeSelectedQuestion(nextQuestion.id);
			this.setState({
				selectedQuestion: nextQuestion,
				chosenProposition: null,
			});
			return;
		}
		if (this.userHaveFinishAllThemes()) {
			IncluscoreAppCommon.resetLocalStorageScr();
			this.storeSelectedIncluscoreEnded(selectedTheme.id);
			this.props.incluscoreAppGoTo(incluscoreHomePath, '', true);
			return;
		}
		// user have finish this theme but not all themes
		this.storeThemeDone(tr(selectedTheme, 'name'));
		this.props.incluscoreAppGoTo(incluscoreThemesPath, '', true);
	};

	propositionResult = () => {
		const {selectedQuestion, chosenProposition} = this.state;
		const goodAnswers = this.getAnswersExplanation();
		let answersPrefix = i18n.t('answers.answerIs', {ns: 'incluscore'});
		if (selectedQuestion.propositions.filter((p) => p.isAGoodAnswer).length > 1) {
			answersPrefix = i18n.t('answers.answersAre', {ns: 'incluscore'});
		}
		return (
			<>
				{chosenProposition.isAGoodAnswer ? (
					<img
						draggable={false}
						src={'/img/lotties/incluscore-good.gif'}
						className={'incluscore-good'}
						alt={'good answer'}
					/>
				) : (
					<div className={'incluscore-fail'}>
						<Lottie
							height={'100%'}
							width={'100%'}
							options={{
								loop: true,
								autoplay: true,
								path: '/img/lotties/incluscore-oups.json',
								rendererSettings: {
									preserveAspectRatio: 'xMidYMid slice',
								},
							}}
						/>
					</div>
				)}
				<h1 className={'c-scr-grey q-title'}>
					{chosenProposition.isAGoodAnswer
						? i18n.t('answers.ok', {ns: 'incluscore'})
						: i18n.t('answers.ko', {ns: 'incluscore'})}
				</h1>
				<p className={'c-scr-grey'}>
					{answersPrefix} {TextToInterpretedTextHelper.getInterpretation(goodAnswers)}
				</p>
				<p className={'c-silver q-explanation text-left'}>
					{TextToInterpretedTextHelper.getInterpretation(tr(selectedQuestion, 'answerExplanation'))}
				</p>
				<button className={'answer-btn'} onClick={() => this.goToNextQuestion()}>
					<Translation ns={['translation', 'incluscore']}>
						{(t) => <>{t('answers.nextQuestion', {ns: 'incluscore'})}</>}
					</Translation>
				</button>
			</>
		);
	};

	public chooseAnswer = async (proposition: PropositionDto) => {
		const {selectedTheme, selectedQuestion, userTheme, launch} = this.state;
		this.analyticsUtils.track(AnalyticsUtils.SCR_USER_ANSWER, {
			isInclucard: false,
			incluscore: launch.idIncluscore?.id,
			theme: selectedTheme.id,
			question: selectedQuestion.id,
			proposition: proposition?.id,
		});
		const updatedUserTheme = await IncluscoreAppQuestions.setChosenProposition(
			proposition,
			selectedTheme.id,
			selectedQuestion.id,
			userTheme?.id,
			false,
			launch.id,
		);
		if (!updatedUserTheme) {
			return;
		}
		this.storeSelectedQuestion(selectedQuestion.id);
		if (launch.userThemes?.find((u) => u.id === updatedUserTheme.id)) {
			launch.userThemes = launch.userThemes.map((u) => {
				return u.id === updatedUserTheme.id ? updatedUserTheme : u;
			});
		} else {
			launch.userThemes.push(updatedUserTheme);
		}
		this.setState({
			chosenProposition: proposition,
			userTheme: updatedUserTheme,
			launch: launch,
		});
	};

	public static setChosenProposition = async (
		proposition: PropositionDto,
		idTheme: string,
		idQuestion: string,
		idUserTheme: string,
		isInclucard: boolean,
		idLaunch: string,
	): Promise<UserThemeDto | null> => {
		const userThemeToSave: SaveUserThemeDto = {
			userId: window.connectedUser.id,
			teamId: window.connectedUser.team?.id,
			themeId: idTheme,
			launchId: idLaunch,
			answer: {
				userId: window.connectedUser.id,
				teamId: window.connectedUser.team?.id,
				themeId: idTheme,
				launchId: idLaunch,
				questionId: idQuestion,
				userAnswer: proposition.id,
			},
		};
		if (idUserTheme) {
			userThemeToSave.id = idUserTheme;
		}
		try {
			if (!isInclucard) {
				showLoader(this.constructor.name);
			}
			const savedUserTheme: UserThemeDto = await HttpRequester.postHttp(USER_THEME_SCR_CTRL, userThemeToSave);
			if (!savedUserTheme) {
				hideLoader(this.constructor.name);
				window.location.href = 'incluscore-app/add-user-theme-error' + window.location.search;
				return null;
			}
			hideLoader(this.constructor.name);
			return savedUserTheme;
		} catch (e) {
			console.error(e);
			hideLoader(this.constructor.name);
			window.location.href = 'incluscore-app/add-user-theme-error' + window.location.search;
			return null;
		}
	};

	multipleAnswers = (question: QuestionDto) => {
		if (question && question.propositions && question.propositions.length > 0) {
			const answers = question.propositions.filter((p) => p.isAGoodAnswer);
			return answers && answers.length > 1;
		}
		return false;
	};

	findIndexOfCurrentQuestion() {
		const {selectedTheme, selectedQuestion} = this.state;
		return selectedTheme.questions.map((q) => q.id).indexOf(selectedQuestion.id);
	}

	render() {
		const {selectedTheme, selectedQuestion, chosenProposition} = this.state;
		const incluscore = this.props.incluscore;
		if (!incluscore || !selectedTheme || !selectedQuestion) {
			return null;
		}
		const nbQuestions = selectedTheme.questions.length;
		return (
			<div className={'incluscore-app question'}>
				<IncluAppHeader
					thumbnail={true}
					incluscore={incluscore}
					companyImgPath={this.props.company.imgPath}
					launch={this.state.launch}
				/>
				{chosenProposition ? (
					<div key={chosenProposition.id}> {this.propositionResult()} </div>
				) : (
					<>
						<h3 className={'c-scr-grey mb-4'}>
							<Translation ns={['translation', 'incluscore']}>
								{(t) => <>{t('answers.askCount', {ns: 'incluscore'})}</>}
							</Translation>{' '}
							{this.findIndexOfCurrentQuestion() + 1}
						</h3>
						<h1 className={'c-silver q-title text-left'}>
							{TextToInterpretedTextHelper.getInterpretation(tr(selectedQuestion, 'title'))}
						</h1>
						{this.multipleAnswers(selectedQuestion) && (
							<p className={'c-scr-grey'}>
								<Translation ns={['translation', 'incluscore']}>
									{(t) => <>{t('answers.multipleGoodAnswers', {ns: 'incluscore'})}</>}
								</Translation>
							</p>
						)}
						{selectedQuestion.propositions.map((proposition) => {
							return proposition.enabled ? (
								<button
									key={proposition.id}
									className={'answer-btn'}
									onClick={() => this.chooseAnswer(proposition)}
								>
									{TextToInterpretedTextHelper.getInterpretation(tr(proposition, 'title'))}
								</button>
							) : null;
						})}
					</>
				)}
				<img
					draggable={false}
					src={`/img/incluscore-app/guys/${this.RANDOM_GUY_IMG}.svg`}
					className={'question-guy-bg'}
					alt={'illustration'}
				/>
				<div className="progress w-100 position-fixed" style={{bottom: 0, left: 0}}>
					<div
						className="progress-bar progress-bar-striped"
						role="progressbar"
						style={{width: `${(this.findIndexOfCurrentQuestion() / nbQuestions) * 100}%`}}
						aria-valuenow={(this.findIndexOfCurrentQuestion() / nbQuestions) * 100}
						aria-valuemin={0}
						aria-valuemax={100}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.initState();
	}
}

export default withRouter(IncluscoreAppQuestions);

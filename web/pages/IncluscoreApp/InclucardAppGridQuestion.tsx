import * as React from 'react';
import {Component} from 'react';
import {TextToInterpretedTextHelper} from './helpers/TextToInterpretedTextHelper';
import './InclucardAppGridQuestion.scss';
import {SCRATCH_TYPE, ScratchCard} from 'scratchcard-js';
import CssVarsHelper from './helpers/CssVarsHelper';
import {UserThemeDto} from '../../../server/src/incluscore/dto/user-theme.dto';
import {QuestionDto} from '../../../server/src/incluscore/dto/question.dto';
import {PropositionDto} from '../../../server/src/incluscore/dto/proposition.dto';
import {ThemeDto} from '../../../server/src/incluscore/dto/theme.dto';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import * as OverlayScrollbars from 'overlayscrollbars';
import {tr} from '../../translations/TranslationsUtils';
import {Translation} from 'react-i18next';

interface iProps extends IncluscoreWrappedComponentProps {
	question: QuestionDto;
	renderAfterMiddle: boolean;
	selectedTheme: ThemeDto;
	userTheme: UserThemeDto;
	updateUserAnswer: (q: QuestionDto, p: PropositionDto) => void;
}

interface iState {
	userPropositionChosen: PropositionDto | null | undefined;
	scratchCardIsInit: boolean;
}

export default class InclucardAppGridQuestion extends Component<iProps, iState> {
	constructor(props) {
		super(props);
		this.state = {
			userPropositionChosen: this.retrieveExistingAnswerId(this.props.question),
			scratchCardIsInit: false,
		};
	}

	qId = this.props.question.id;
	enterAnimationClass = 'animate__animated animate__flipInY';

	retrieveExistingAnswerId = (q: QuestionDto): PropositionDto | null | undefined => {
		const answer = this.props.userTheme?.answers?.find((a) => a && a.questionId.id === q.id);
		return answer?.userAnswer;
	};

	// https://masth0.github.io/ScratchCard/brushes/line.html
	async initScratchCard(hideScratchCanvas?) {
		if (this.state.scratchCardIsInit) {
			return;
		}
		const answerContainer = document.querySelector('.answer-container') as HTMLElement;
		const sc = new ScratchCard('#js--sc--container-' + this.qId, {
			scratchType: SCRATCH_TYPE.LINE,
			brushSrc: '',
			imageForwardSrc: '/img/incluscore-app/scratch-card.svg',
			imageBackgroundSrc: '',
			htmlBackground: `<div class="inner_html"><p>${tr(this.props.question, 'answerExplanation')}</p></div>`,
			clearZoneRadius: 30,
			nPoints: 50,
			pointSize: 4,
			percentToFinish: 40, // scratch 40 yourself then it will finish auto
			callback: () => {
				// console.debug('scratch end');
				this.removeAlreadyAnsweredCanvas();
			},
		});

		// Init
		await sc.init();
		sc.canvas.addEventListener('scratch.move', () => {
			OverlayScrollbars(document.querySelectorAll('.inner_html'), {});
		});
		const canvas = document.querySelector(
			'#js--sc--container-' + this.qId + ' canvas.sc__canvas',
		) as HTMLCanvasElement;
		const scratchableAreaWidth = answerContainer.offsetWidth - 20;
		const scratchableAreaHeight = answerContainer.offsetHeight - 20;
		canvas.height = scratchableAreaHeight;
		canvas.width = scratchableAreaWidth;
		if (hideScratchCanvas) {
			this.setState({
				scratchCardIsInit: true,
			});
			return; // dont show scratch canvas
		}
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = CssVarsHelper.getColorFromVariableName('--inclucard-main-color');
		ctx.fillRect(0, 0, scratchableAreaWidth, scratchableAreaHeight);
		this.setState({
			scratchCardIsInit: true,
		});
	}

	// sometimes canvas isn't well init, with a default small size
	fixBadCanvasSize = () => {
		const answerContainer = document.querySelector('.answer-container') as HTMLElement;
		const scratchableAreaWidth = answerContainer?.offsetWidth - 20;
		const scratchableAreaHeight = answerContainer?.offsetHeight - 20;
		const canvasList = document.querySelectorAll('canvas.sc__canvas') as NodeListOf<HTMLCanvasElement>;
		for (const canvas of canvasList) {
			if (canvas.width === scratchableAreaWidth) {
				continue;
			}
			canvas.height = scratchableAreaHeight;
			canvas.width = scratchableAreaWidth;
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = CssVarsHelper.getColorFromVariableName('--inclucard-main-color');
			ctx.fillRect(0, 0, scratchableAreaWidth, scratchableAreaHeight);
		}
	};

	updateUserAnswer = async (q: QuestionDto, p: PropositionDto) => {
		if (!this.state.userPropositionChosen) {
			this.setState({userPropositionChosen: p});
			this.props.updateUserAnswer(q, p);
		}
	};

	renderAllPropositions = (q: QuestionDto) => {
		return (
			<>
				{this.renderProposition(q, q.propositions[0])}
				{this.renderProposition(q, q.propositions[1])}
			</>
		);
	};

	renderProposition = (q: QuestionDto, p: PropositionDto) => {
		const checked = this.state.userPropositionChosen && this.state.userPropositionChosen.id === p.id;
		return (
			<div
				className={`label-checkbox-container ${checked ? 'answer-checked' : ''} ${
					this.state.userPropositionChosen ? 'question-answered' : ''
				} ${p.isAGoodAnswer ? 'is-good-answer' : ''}`}
			>
				<p className={'answer'}>{TextToInterpretedTextHelper.getInterpretation(tr(p, 'title'))}</p>
				<div
					onClick={async () => {
						await this.updateUserAnswer(q, p);
					}}
					className={`custom-checkbox`}
				>
					{checked && (
						<img
							draggable={false}
							width={'100%'}
							className={'img-good-answer d-inline-block'}
							src={'/img/incluscore-app/check-answer-inclucard.svg'}
							alt={'good-answer'}
						/>
					)}
				</div>
			</div>
		);
	};

	renderAnswer() {
		return (
			<div className={'answer-container animate__animated animate__heartBeat'}>
				<p className={'scratch-explanation'}>
					<Translation ns={['translation', 'inclucard']}>
						{(t) => <>{t('grid.scratchThatSquare', {ns: 'inclucard'})}</>}
					</Translation>
				</p>
				<div className={'scratch-card-component'}>
					<div id={'js--sc--container-' + this.qId} className="sc__container">
						{/* scratch content */}
					</div>
				</div>
			</div>
		);
	}

	renderQuestion() {
		return (
			<div className={'question-asked'}>
				<p>{TextToInterpretedTextHelper.getInterpretation(tr(this.props.question, 'title'))}</p>
			</div>
		);
	}

	render() {
		const questionAnswered = this.state.userPropositionChosen != null;
		return (
			<div className={'question-div-wrapper'}>
				{questionAnswered ? this.renderAnswer() : this.renderQuestion()}
				<div className={'answers-checkbox'}>{this.renderAllPropositions(this.props.question)}</div>
			</div>
		);
	}

	removeScratchExplanation = () => {
		const currentExplanation = document.querySelector(`.q-${this.qId} .scratch-explanation`);
		if (currentExplanation) {
			document.querySelector(`.q-${this.qId} .scratch-explanation`).remove();
		}
	};

	removeAlreadyAnsweredCanvas = () => {
		this.removeScratchExplanation();
		document.querySelector(`.q-${this.qId} .sc__canvas`).classList.add('d-none');
	};

	async componentDidUpdate() {
		// init scratch card after user has selected an answer
		if (this.state.userPropositionChosen) {
			await this.initScratchCard();
			// mouseover desktop only
			window.$(`.q-${this.qId} .scratch-card-component`).on('mousedown', () => {
				this.removeScratchExplanation();
			});
			// touchmove mobile only
			window.$(`.q-${this.qId} .scratch-card-component`).on('touchstart', () => {
				this.removeScratchExplanation();
			});
		}
	}

	async componentDidMount() {
		document.querySelector('.app-wrapper')?.classList?.add('h-100');
		if (this.state.userPropositionChosen) {
			await this.initScratchCard(true);
			this.removeAlreadyAnsweredCanvas();
			OverlayScrollbars(document.querySelectorAll('.inner_html'), {});
		} else {
			setInterval(() => {
				this.fixBadCanvasSize();
			}, 500);
		}
	}
}

import IncluscoreAppCommon from './IncluscoreAppCommon';
import IncluscoreMenu from './layout/IncluscoreMenu';
import {withRouter} from 'react-router-dom';
import * as React from 'react';
import './InclucardAppGrid.scss';
import InclucardAppGridQuestion from './InclucardAppGridQuestion';
import {QuestionDto} from '../../../server/src/incluscore/dto/question.dto';
import {IncluscoreWrappedComponentProps} from '../../typings/incluscore-app';
import {UserThemeDto} from '../../../server/src/incluscore/dto/user-theme.dto';
import {PropositionDto} from '../../../server/src/incluscore/dto/proposition.dto';
import IncluscoreAppQuestions from './IncluscoreAppQuestions';
import {LogoNavBar} from '../../components/menu/navBarLogo/LogoNavBar';
import {AnalyticsUtils} from '../../utils/AnalyticsUtils';

class InclucardAppGrid extends IncluscoreAppCommon<IncluscoreWrappedComponentProps, IncluscoreWrappedComponentProps> {
	analyticsUtils = new AnalyticsUtils(this);
	constructor(props) {
		super(props);
		this.state = {
			...this.props,
		};
	}

	themesScoreSum = () => {
		let score = 0;
		this.state.launch.userThemes.map((u) => {
			const isUserScore = u && u.userId.id === window.connectedUser.id;
			if (isUserScore) {
				score += Number(u.score);
			}
		});
		return score;
	};

	updateUserAnswer = async (q: QuestionDto, p: PropositionDto) => {
		const {launch, incluscore} = this.state;

		this.analyticsUtils.track(AnalyticsUtils.SCR_USER_ANSWER, {
			isInclucard: true,
			incluscore: incluscore?.id,
			theme: incluscore?.themes ? incluscore?.themes[0]?.id : null,
			question: q?.id,
			proposition: p?.id,
		});
		const updatedUserTheme: UserThemeDto = await IncluscoreAppQuestions.setChosenProposition(
			p,
			incluscore.themes[0].id,
			q.id,
			launch.userThemes?.find((u) => u && u.userId.id === window.connectedUser.id)?.id,
			true,
			this.props.launch.id,
		);
		if (launch.userThemes?.find((u) => u.id === updatedUserTheme.id)) {
			launch.userThemes = launch.userThemes.map((u) => {
				return u.id === updatedUserTheme.id ? updatedUserTheme : u;
			});
		} else {
			launch.userThemes.push(updatedUserTheme);
		}
		this.setState({
			launch: launch,
		});
	};

	render() {
		const incluscore = this.props.incluscore;
		const theme = incluscore.themes[0];
		const isInclucard = incluscore.isInclucard;
		return (
			<div className={'grid-inclucard-structure'}>
				<IncluscoreMenu
					score={this.themesScoreSum()}
					isInclucard={isInclucard}
					goToMethod={(path) => this.props.incluscoreAppGoTo(path)}
				/>
				<div className={'d-block d-md-none inclucard-feat-company'}>
					<LogoNavBar goTo={() => null} companyImgProvided={this.props.launch.idCompany.imgPath} />
				</div>
				<div className={'incluscore-app inclucard-app grid-page'}>
					<div className={'flexible-squares-container'}>
						<div className={'magic-square-cell no-background design-square order-0'}>
							<img
								draggable={false}
								src={'/themes-logo/' + theme.imgPath}
								alt={'image-company-1'}
								className={'img-company img-company-1'}
							/>
						</div>
						<div className={'magic-square-cell no-background design-square order-2'}>
							<img
								draggable={false}
								src={'/themes-logo/' + theme.imgPath2}
								alt={'image-company-2'}
								className={'img-company img-company-2'}
							/>
						</div>
						<div className={'magic-square-cell no-background design-square order-999'}>
							<img
								draggable={false}
								src={'/themes-logo/' + theme.imgPath3}
								alt={'image-company-3'}
								className={'img-company img-company-3'}
							/>
						</div>
						{theme.questions.map((q, i) => {
							return (
								<div
									key={i}
									className={`card-component magic-square-cell question-cell q-${q.id} ${
										i > 2 ? 'order-3' : ''
									}`}
								>
									<img
										draggable={false}
										width={'100%'}
										className={'inclucard-card-container'}
										src={'/img/incluscore-app/inclucard-card-container.svg'}
										alt={'card-container'}
									/>
									<InclucardAppGridQuestion
										{...this.props}
										key={i}
										question={q}
										renderAfterMiddle={i > 2}
										selectedTheme={this.props.incluscore.themes[0]}
										userTheme={this.props.launch.userThemes?.find(
											(u) => u && u.userId.id === window.connectedUser.id,
										)}
										updateUserAnswer={this.updateUserAnswer}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	getAnHeightModuloTreeEqualsZero(height: number) {
		if (height % 3 === 0) {
			return height;
		}
		return this.getAnHeightModuloTreeEqualsZero(height - 1);
	}

	componentDidMount() {
		document.querySelector('.app-wrapper')?.classList?.add('h-100');
		// we call it that way because all length in this page is closely based on this variable
		const magicSquareLength = window.innerHeight;
		if (window.innerWidth > 990) {
			const gridInclucardStructure = document.querySelector('.grid-inclucard-structure') as HTMLElement;
			gridInclucardStructure.style.height = magicSquareLength + 'px';
			gridInclucardStructure.style.width = magicSquareLength + 'px';
			gridInclucardStructure.style.overflow = 'hidden';
			gridInclucardStructure.style.margin = 'auto';
		}
	}
}

export default withRouter(InclucardAppGrid);

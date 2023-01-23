import * as React from 'react';
import {Component} from 'react';
import CountUp from 'react-countup';
import Lottie from 'react-lottie';
import './IncluscoreCounter.scss';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {Translation} from 'react-i18next';

interface IncluscoreCounterProps {
	isThumbnail: boolean;
	incluscore: IncluscoreDto;
	launch: LaunchIncluscoreDto;
}

class IncluscoreCounter extends Component<IncluscoreCounterProps, any> {
	themesScoreSum = () => {
		let score = 0;
		if (this.props.launch.userThemes?.length > 0) {
			this.props.launch.userThemes.map((u) => {
				const isUserScore = u?.userId?.id === window.connectedUser.id;
				if (isUserScore) {
					score += Number(u.score);
				}
			});
		}
		return score;
	};

	render() {
		const isInclucard = this.props.incluscore.isInclucard;
		return (
			<div
				className={`score-counter-component ${this.props.isThumbnail ? 'is-thumbnail' : ''} ${
					isInclucard ? 'is-inclucard' : ''
				}`}
			>
				<h1 className={'c-scr-grey score-title'}>
					<Translation ns={['translation', 'incluscore']}>
						{(t) => <>{t('counter.score', {ns: 'incluscore'})}</>}
					</Translation>
				</h1>
				<div className={'score-wrapper'}>
					{!this.props.isThumbnail && (
						<div
							className={'position-absolute'}
							style={{
								zIndex: 9,
								marginTop: -32,
								marginLeft: -32,
								width: '100%',
							}}
						>
							<Lottie
								height={198}
								width={'calc(100% + 68px)'}
								options={{
									loop: true,
									autoplay: true,
									path: '/img/lotties/fireworks-score.json',
									rendererSettings: {
										preserveAspectRatio: 'xMidYMid slice',
									},
								}}
							/>
						</div>
					)}
					<div className={'wrapper-img-container'}>
						<object
							className={'wrapper object-svg-score-wrapper'}
							data={'/img/incluscore-app/score-wrapper.svg'}
							type="image/svg+xml"
						/>
						{this.props.launch && this.props.launch.userThemes && !isNaN(this.themesScoreSum()) && (
							<>
								<div className={'score-content c-silver'} style={{zIndex: 1}}>
									<CountUp duration={2} end={this.themesScoreSum()} />
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default IncluscoreCounter;

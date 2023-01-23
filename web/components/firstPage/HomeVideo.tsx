import * as React from 'react';
import {Component} from 'react';
import './HomeVideo.scss';

export default class HomeVideo extends Component<any, any> {
	defaultTextOne = ' notre accompagnement,';
	alternativeTextOne = ' notre expertise,';
	thirdTextOne = ' notre différence.';
	activedTextOne = this.defaultTextOne;

	constructor(props) {
		super(props);
	}

	replaceOperation(text: string) {
		const changingText = document.querySelector(
			'.page-video .color-changing-text',
		) as HTMLElement;
		if (changingText) {
			changingText.classList.add('invisible');
			setTimeout(() => {
				changingText.innerHTML = text;
				changingText.classList.remove('invisible');
			}, 1000);
		}
	}

	setText() {
		setInterval(() => {
			if (this.activedTextOne === this.thirdTextOne) {
				this.activedTextOne = this.defaultTextOne;
				this.replaceOperation(this.activedTextOne);
			} else if (this.activedTextOne === this.alternativeTextOne) {
				this.activedTextOne = this.thirdTextOne;
				this.replaceOperation(this.activedTextOne);
			} else {
				this.activedTextOne = this.alternativeTextOne;
				this.replaceOperation(this.activedTextOne);
			}
		}, 4500);
	}

	componentDidMount() {
		setTimeout(() => {
			this.activedTextOne = this.alternativeTextOne;
			this.replaceOperation(this.activedTextOne);
		}, 1000);
		this.setText();
	}

	render(): JSX.Element {
		return (
			<>
				<div id={'anchor-video'} />
				<div className={'row page-left-right page-video'}>
					<div className={'col-lg-6 col-with-paragraph-left'}>
						<div className={'left-content y'}>
							<h1>
								Votre IncluKathon,
								<br />
								<span className={'color-changing-text'}>
									{' '}
									{this.activedTextOne}{' '}
								</span>
							</h1>
							<p className={'d-none d-lg-block'}>
								A la croisée entre «&nbsp;Inclusion&nbsp;» et
								«&nbsp;Hackathon&nbsp;», l’IncluKathon est un
								concept porteur de projets, basé sur
								l'intelligence collective, qui s’inscrit dans
								une démarche d’innovation.
								<br />
								<br />
								Cet évènement consiste à réunir en équipes,
								différents profils afin de répondre à une
								problématique que vous définirez.
							</p>
							<p className={'d-block d-lg-none'}>
								Envie d’organiser un challenge d’innovation ?
								<br />
								Découvrez comment IncluKathon vous accompagne
								dans la réussite de votre évènement.
							</p>
							<a
								className="link d-none d-lg-inline"
								href={'/services-page'}
							>
								Allons plus loin
							</a>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content y'}>
							<div className={'iframe-container'}>
								<iframe
									width="560"
									height="315"
									src="https://www.youtube.com/embed/tKoE_KsGCdk"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

import * as React from 'react';
import {Component} from 'react';
import './Values.scss';
import {Animations} from '../../utils/OnScrollHelper';
import {getIsMobile} from '../../index';

interface IValues {
	isMobile: boolean | null | undefined;
}

export default class Values extends Component<any, IValues> {
	defaultTextOne = 'nclusion,';
	alternativeTextOne = 'ntelligence collective,';
	thirdTextOne = 'nnovation.';
	activedTextOne = this.defaultTextOne;

	constructor(props) {
		super(props);
		const isMobileInit = getIsMobile();

		this.state = {
			isMobile: isMobileInit,
		};
	}

	replaceOperation(text: string) {
		const changingText = document.querySelector(
			'.page-values .color-changing-text:not(.dont-change)',
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
		window.onresize = () => {
			const resizedIsMobile = getIsMobile();
			if (resizedIsMobile !== this.state.isMobile) {
				this.setState({
					isMobile: resizedIsMobile,
				});
			}
		};
		setTimeout(() => {
			this.activedTextOne = this.alternativeTextOne;
			this.replaceOperation(this.activedTextOne);
		}, 1000);
		this.setText();
		if (this.state.isMobile) {
			Animations.flipXOnElementVisible('.values-container');
		}
	}

	render(): JSX.Element {
		return (
			<>
				<div>
					<div id={'page-values'} className={'row page-left-right page-values'}>
						<div className={'col-lg-12'}>
							<h1 className={'main-page-title'}>
								Nos valeurs:
								<span className={'color-changing-text dont-change d-none d-lg-inline-block'}>
									&nbsp;I
								</span>
								<span className={'color-changing-text dont-change d-lg-none'}> I</span>
								<span className={'color-changing-text'}>{this.activedTextOne}</span>
							</h1>
						</div>
						<div className={'col-lg-6 col-with-paragraph-left'}>
							<div className={'left-content y'}>
								<img
									draggable={false}
									className={'brand-illustration m-auto d-block d-lg-none'}
									src={'/img/commercial/Illustration_10.svg'}
									alt={'brand-illustration'}
								/>
								<div className={'values-container'}>
									<h1 className={'values-title'}>Inclusion</h1>
									<p className={'small-paragraph-title'}>
										Engager les acteur·ice·s d'aujourd'hui et de demain et les sensibiliser dans une
										démarche bienveillante.
									</p>
								</div>
								<div className={'values-container'}>
									<h1 className={'values-title'}>Intelligence collective</h1>
									<p className={'small-paragraph-title'}>
										Promouvoir le partage de savoirs et d'expériences pour un "melting pot" d'idées
										créatives, représentatives des acteurs de notre société.
									</p>
								</div>
								<div className={'values-container last-value-container'}>
									<h1 className={'values-title'}>Innovation</h1>
									<p className={'small-paragraph-title'}>
										Permettre à chacun de développer des pensées innovantes "out of the box" et
										accompagner le déploiement des projets.
									</p>
								</div>
							</div>
						</div>
						<div className={'col-lg-6 d-none d-lg-block'}>
							<div className={'right-content x y'}>
								<img
									draggable={false}
									className={'brand-illustration'}
									src={'/img/commercial/Illustration_10.svg'}
									alt={'brand-illustration'}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

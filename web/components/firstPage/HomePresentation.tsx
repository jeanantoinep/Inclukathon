import * as React from 'react';
import {Component} from 'react';
import './HomePresentation.scss';
import {contactPath} from '../../routes/publicRoutes';

export default class HomePresentation extends Component<any, any> {
	defaultTextOne = ' IncluKathon, experte en Inclusion.';
	alternativeTextOne = ' HandiKathon, experte du Handicap.';
	activedTextOne = this.defaultTextOne;

	constructor(props) {
		super(props);
		this.goToContactPage = this.goToContactPage.bind(this);
	}

	replaceOperation(text: string) {
		const changingText = document.querySelector(
			'.page-presentation .color-changing-text',
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
			if (this.activedTextOne === this.alternativeTextOne) {
				this.activedTextOne = this.defaultTextOne;
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

	goToContactPage() {
		window.location.href = contactPath;
	}

	render(): JSX.Element {
		return (
			<div
				className={'row page-left-right page-presentation'}
				id={'presentation-component'}
			>
				<div className={'col-lg-6'}>
					<div className={'left-content x y'}>
						<img
							draggable={false}
							className={'brand-illustration'}
							src={'/img/commercial/Illustration_1.svg'}
							alt={'brand-illustration'}
						/>
					</div>
				</div>
				<div className={'col-12 col-lg-6'}>
					<div className={'right-content y'}>
						<h1>
							Organisez votre challenge d'innovation avec
							<span className={'color-changing-text'}>
								{' '}
								{this.activedTextOne}{' '}
							</span>
						</h1>
						<button
							className="btn-brand-sub-text btn d-lg-none"
							type="submit"
							onClick={this.goToContactPage}
						>
							Contactez-nous
						</button>
						<button
							className="btn-brand-sub-text btn d-none d-lg-block"
							type="submit"
							onClick={this.goToContactPage}
						>
							En savoir plus
						</button>
					</div>
				</div>
			</div>
		);
	}
}

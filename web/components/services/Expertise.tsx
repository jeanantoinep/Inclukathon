import * as React from 'react';
import {Component} from 'react';
import './Expertise.scss';
import ListStyled from '../htmlList/ListStyled';

export default class Expertise extends Component<any, any> {
	defaultTextOne = 'IncluKathon';
	alternativeTextOne = 'HandiKathon';
	activeTextOne = this.defaultTextOne;

	replaceOperation(text: string) {
		const changingText = document.querySelector(
			'.page-expertise-more .color-changing-text',
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
			if (this.activeTextOne === this.alternativeTextOne) {
				this.activeTextOne = this.defaultTextOne;
				this.replaceOperation(this.activeTextOne);
			} else {
				this.activeTextOne = this.alternativeTextOne;
				this.replaceOperation(this.activeTextOne);
			}
		}, 4500);
	}

	componentDidMount() {
		setTimeout(() => {
			this.activeTextOne = this.alternativeTextOne;
			this.replaceOperation(this.activeTextOne);
		}, 1000);
		this.setText();
	}

	render(): JSX.Element {
		return (
			<>
				<div
					id={'page-expertise'}
					className={'row page-left-right page-expertise'}
				>
					<div className={'col-lg-12'}>
						<h1 className={'main-page-title d-none d-lg-block'}>
							Expertise
						</h1>
					</div>
					<div className={'col-lg-6 col-with-paragraph-left'}>
						<div className={'left-content y'}>
							<h1 className={'second-title d-none d-lg-block'}>
								Définition de votre challenge
							</h1>
							<h1 className={'second-title d-lg-none'}>
								Nous définissons votre challenge
							</h1>
							<p className={'d-none d-lg-block'}>
								Nos experts vous accompagnent dans la précision
								de votre évènement&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: 'Définition de votre problématique',
									},
									{
										text: "Benchmark et sélection d'une thématique claire et innovante",
									},
									{
										text: 'Détermination de vos objectifs',
									},
									{
										text: 'Désignation de votre public cible',
									},
								]}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content x y'}>
							<img
								draggable={false}
								className={'brand-illustration'}
								src={'/img/commercial/Illustration_2.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
				<div className={'row page-left-right page-expertise-more'}>
					<div className={'col-lg-6'}>
						<div className={'left-content x y'}>
							<img
								draggable={false}
								className={
									'brand-illustration organisation d-none d-lg-block'
								}
								src={'/img/commercial/Illustration_6.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content y'}>
							<h1 className={'d-none d-lg-block'}>
								Organisation de votre{' '}
								<span className={'color-changing-text'}>
									{this.activeTextOne}
								</span>
							</h1>
							<h1 className={'d-lg-none'}>
								L'organisation de votre{' '}
								<span className={'color-changing-text'}>
									{this.activeTextOne}
								</span>
							</h1>
							<p className={'d-none d-lg-block'}>
								L'agence définit et prend en charge toutes les
								étapes pour un évènement réussi&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: 'Détermination du lieu idéal',
										hideInMobile: true,
									},
									{
										text: 'Coordination des parties prenantes',
										hideInMobile: true,
									},
									{
										text: 'Coordination des parties prenantes et gestion de la logistique',
										hideInDesktop: true,
									},
									{
										text: 'Recherche et pilotage des prestataires',
										hideInMobile: true,
									},
									{
										text: 'Recherche et pilotage des prestataires et du lieu idéal',
										hideInDesktop: true,
									},
									{
										text: "Rétroplanning de l'organisation et reporting régulier",
									},
									{
										text: 'Gestion de la logistique',
										hideInMobile: true,
									},
									{
										text: "Proposition d'experts pour un challenge de qualité",
									},
								]}
							/>
							<img
								draggable={false}
								className={
									'brand-illustration organisation d-block d-lg-none'
								}
								src={'/img/commercial/Illustration_6.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

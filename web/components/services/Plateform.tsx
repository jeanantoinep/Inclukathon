import * as React from 'react';
import {Component} from 'react';
import './Plateform.scss';
import ListStyled from '../htmlList/ListStyled';

export default class Plateform extends Component<any, any> {
	defaultTextOne = ' piloter';
	alternativeTextOne = ' animer';
	thirdTextOne = ' encadrer';
	activeTextOne = this.defaultTextOne;

	replaceOperation(text: string) {
		const changingText = document.querySelector(
			'.page-platform .color-changing-text:not(.dont-change)',
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
			if (this.activeTextOne === this.thirdTextOne) {
				this.activeTextOne = this.defaultTextOne;
				this.replaceOperation(this.activeTextOne);
			} else if (this.activeTextOne === this.alternativeTextOne) {
				this.activeTextOne = this.thirdTextOne;
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
					id={'page-platform'}
					className={'row page-left-right page-platform'}
				>
					<div className={'col-lg-12'}>
						<h1 className={'main-page-title d-none d-lg-block'}>
							Plateforme
						</h1>
					</div>
					<div className={'col-lg-6 col-with-paragraph-left'}>
						<div className={'left-content y'}>
							<h1>
								IncluKathon.com, votre plateforme dédiée pour
								<span className={'color-changing-text'}>
									{' '}
									{this.activeTextOne}{' '}
								</span>
							</h1>
							<p className={'d-none d-lg-block'}>
								Nous créons pour votre évènement une plateforme
								personnalisée&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: 'Explication du challenge',
										hideInMobile: true,
									},
									{
										text: 'Coaching des participant·e·s',
										hideInMobile: true,
									},
									{
										text: 'Notation des jurys',
										hideInMobile: true,
									},
									{
										text: 'Bibliothèque personnalisée (culture du sujet)',
										hideInMobile: true,
									},
									{
										text: 'Messagerie instantanée',
										hideInMobile: true,
									},
									{
										text: 'Conférence et rendez-vous digitaux avec les expert·e·s',
										hideInMobile: true,
									},
									{
										text: 'Dépôts des livrables',
										hideInMobile: true,
									},
									{
										text: 'Espace dédié pour chaque équipe',
										hideInMobile: true,
									},
									{
										text: "Compte organisateur pour une visibilité complète de l'évènement",
										hideInMobile: true,
									},
									{
										text: 'Espace dédié pour chaque équipe et compte organisateur',
										hideInDesktop: true,
									},
									{
										text: 'Conférence et rendez-vous digitaux avec les expert·e·s et coaching des participant·e·s',
										hideInDesktop: true,
									},
									{
										text: 'Bibliothèque personnalisée et messagerie instantanée',
										hideInDesktop: true,
									},
									{
										text: 'Dépôts des livrables et notation des jurys',
										hideInDesktop: true,
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
								src={'/img/commercial/Illustration_3.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

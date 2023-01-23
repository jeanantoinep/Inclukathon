import * as React from 'react';
import {Component} from 'react';
import './HowWeAre.scss';
import ListStyled from '../htmlList/ListStyled';

export default class HowWeAre extends Component<any, any> {
	render(): JSX.Element {
		return (
			<>
				<div
					id={'page-how-we-are'}
					className={'row page-left-right page-how-we-are'}
				>
					<div className={'col-lg-12'}>
						<img
							draggable={false}
							className={'brand-illustration d-block d-lg-none'}
							src={'/img/commercial/Illustration_9.svg'}
							alt={'brand-illustration'}
						/>
						<h1 className={'main-page-title who-title'}>
							Qui sommes-nous ?
						</h1>
					</div>
					<div className={'col-lg-6 d-none d-lg-block'}>
						<div className={'left-content x y'}>
							<img
								draggable={false}
								className={'brand-illustration'}
								src={'/img/commercial/Illustration_9.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content y'}>
							<p>
								Notre raison d'être, vous conduire d'une logique
								intégrante à une logique inclusive.
								Comment&nbsp;? Notre expertise comprend 3
								piliers&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: 'Accompagner vos politiques de diversité pour entrer dans une dynamique inclusive',
									},
									{
										text: 'Déployer une stratégie opérationnelle de Diversité',
									},
									{
										text: "Sensibiliser au travers d'évènements innovants basés sur l’intelligence collective",
									},
								]}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

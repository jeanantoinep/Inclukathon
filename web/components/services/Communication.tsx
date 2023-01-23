import * as React from 'react';
import {Component} from 'react';
import './Communication.scss';
import ListStyled from '../htmlList/ListStyled';

export default class Communication extends Component<any, any> {
	render(): JSX.Element {
		return (
			<>
				<div
					id={'page-communication'}
					className={'row page-left-right page-communication'}
				>
					<div className={'col-lg-12'}>
						<h1 className={'main-page-title d-none d-lg-block'}>
							Communication
						</h1>
					</div>
					<div className={'col-lg-6 col-with-paragraph-left'}>
						<div className={'left-content y'}>
							<h1>
								Un plan de communication percutant&nbsp;: reflet
								d'une marque employeur engagée
							</h1>
							<p className={'d-none d-lg-block'}>
								Nous vous accompagnons dans une communication
								optimum pour booster la visibilité de votre
								marque employeur et faire connaitre votre
								engagement en interne et en externe&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: "Conception de vos visuels personnalisés de l'évènement",
									},
									{
										text: 'Proposition de contenus de communication à 360° (éditorial, vidéos, digital, réseaux sociaux)',
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
								src={'/img/commercial/Illustration_5.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

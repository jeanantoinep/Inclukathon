import * as React from 'react';
import {Component} from 'react';
import './Incluscore.scss';
import ListStyled from '../htmlList/ListStyled';

export default class Incluscore extends Component<any, any> {
	render(): JSX.Element {
		return (
			<>
				<div
					id={'page-incluscore'}
					className={'row page-left-right page-incluscore'}
				>
					<div className={'col-lg-12'}>
						<h1 className={'main-page-title d-none d-lg-block'}>
							IncluScore
						</h1>
					</div>
					<div className={'col-lg-6'}>
						<div className={'left-content x y'}>
							<img
								draggable={false}
								className={
									'brand-illustration d-none d-lg-block'
								}
								src={'/img/commercial/Illustration_4.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content y'}>
							<h1>
								IncluScore, l'indicateur qui mesure la
								performance
							</h1>
							<p className={'d-none d-lg-block'}>
								Nous développons un quiz via une plateforme
								personnalisée pour capitaliser vos KPIs.
							</p>
							<p className={'d-none d-lg-block'}>
								IncluScore vous permettra de&nbsp;:
							</p>
							<ListStyled
								links={[
									{
										text: 'Mesure de l’atteinte de vos objectifs',
									},
									{
										text: "Communiquer en amont et en aval de l'évènement",
									},
									{
										text: 'Fil conducteur de votre campagne de sensibilisation',
										hideInDesktop: true,
									},
									{
										text: 'Quiz via une plateforme personnalisée pour capitaliser vos KPIs',
										hideInDesktop: true,
									},
									{
										text: 'Donner un fil conducteur à votre campagne de sensibilisation',
										hideInMobile: true,
									},
								]}
							/>
							<img
								draggable={false}
								className={
									'brand-illustration d-block d-lg-none'
								}
								src={'/img/commercial/Illustration_4.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

import * as React from 'react';
import {Component} from 'react';
import './InclusionConseil.scss';

export default class InclusionConseil extends Component<any, any> {
	render(): JSX.Element {
		return (
			<>
				<div
					id={'page-inclusion-conseil-content'}
					className={
						'row page-left-right page-inclusion-conseil-content'
					}
				>
					<div className={'col-lg-12'}>
						<h1 className={'main-page-title'}>
							IncluKathon, un évènement Inclusion Conseil
						</h1>
					</div>
					<div className={'col-lg-6'}>
						<div className={'left-content x y'}>
							<img
								draggable={false}
								className={
									'brand-illustration d-none d-lg-block'
								}
								src={'/img/commercial/Illustration_7.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content mobile-centered y'}>
							<p>
								Inclusion Conseil accompagne les entreprises
								dans le déploiement de leur politique Diversité.
								<br />
								<br />
								Notre objectif est de vous accompagner afin que
								l’environnement dans lequel travaille vos
								collaborateur·rice·s, soit sur une même base
								d’égalité des chances, quelque soit leur
								handicap, origine, genre, statut, âge, culture
								ou encore religion.
							</p>
							<p className={'our-moto-title'}>
								Notre devise&nbsp;:
							</p>
							<p
								className={
									'citation citation-how-we-are text-violet'
								}
							>
								«&nbsp;La différence comme source de
								performance&nbsp;»​
							</p>
						</div>
					</div>
				</div>
				<div
					id={'page-inclusion-conseil-content'}
					className={
						'row page-left-right page-inclusion-conseil-content d-none d-lg-flex'
					}
				>
					<div className={'col-lg-6 col-with-paragraph-left'}>
						<div className={'left-content y'}>
							<h1 className={''}>
								Qu'est-ce que la Diversité&nbsp;?
							</h1>
							<p>
								<span
									className={
										'text-center text-violet w-100 d-inline-block'
									}
								>
									“&nbsp;La créativité et le génie ne peuvent
									s'épanouir que dans un milieu qui respecte
									l'individualité et célèbre la
									diversité.&nbsp;”
								</span>
								<span
									className={
										'text-center font-italic w-100 d-inline-block'
									}
								>
									Tom Alexander​
								</span>
							</p>
							<p>
								En entreprise, la notion de responsabilités
								sociales est devenue au centre des priorités. ​
							</p>
							<p>
								Elle permet de lutter contre les différentes
								formes de discriminations quelles quels soient
								et prendre en considération chaque différence,
								pour développer les compétences de chacun.​
							</p>
						</div>
					</div>
					<div className={'col-lg-6 d-none d-lg-block'}>
						<div className={'right-content no-padding x y'}>
							<img
								draggable={false}
								className={'brand-illustration big-img'}
								src={'/img/commercial/Illustration_8.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

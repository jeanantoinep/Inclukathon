import * as React from 'react';
import {Component} from 'react';
import './HomeServices.scss';

export default class HomeServices extends Component<any, any> {
	constructor(props) {
		super(props);
	}

	goTo(href: string, hash?: string) {
		if (!hash) {
			window.location.href = href;
			return;
		}
		window.location.href = href + '?scroll-to=' + hash;
	}

	render() {
		return (
			<>
				<div
					className={
						'page-full-width page-services d-none d-lg-block'
					}
				>
					<h1 className={'centered-title'}>Nos services</h1>
				</div>
				<div className={'row page-penny-animation d-none d-lg-flex'}>
					<div
						className={'col-lg-3'}
						onClick={() => this.goTo('/services-page')}
					>
						<img
							draggable={false}
							className={'penny-animation-icon'}
							src={'/img/commercial/Illustration_2.svg'}
							alt={'brand-illustration'}
						/>
						<p className={'penny-link'}>Expertise</p>
					</div>
					<div
						className={'col-lg-3'}
						onClick={() =>
							this.goTo('/services-page', 'page-platform')
						}
					>
						<img
							draggable={false}
							className={'penny-animation-icon'}
							src={'/img/commercial/Illustration_3.svg'}
							alt={'brand-illustration'}
						/>
						<p className={'penny-link'}>IncluKathon.com</p>
					</div>
					<div
						className={'col-lg-3'}
						onClick={() =>
							this.goTo('/services-page', 'page-incluscore')
						}
					>
						<img
							draggable={false}
							className={'penny-animation-icon'}
							src={'/img/commercial/Illustration_4.svg'}
							alt={'brand-illustration'}
						/>
						<p className={'penny-link'}>IncluScore</p>
					</div>
					<div
						className={'col-lg-3'}
						onClick={() =>
							this.goTo('/services-page', 'page-communication')
						}
					>
						<img
							draggable={false}
							className={'penny-animation-icon'}
							src={'/img/commercial/Illustration_5.svg'}
							alt={'brand-illustration'}
						/>
						<p className={'penny-link'}>Communication</p>
					</div>
				</div>
			</>
		);
	}
}

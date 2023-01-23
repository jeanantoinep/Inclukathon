import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faInstagramSquare, faLinkedin, faYoutube} from '@fortawesome/free-brands-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(faEnvelope, faPhone, faInstagramSquare, faLinkedin, faYoutube);
import './Footer.scss';
import {appLoggedPath, contactPath} from '../routes/publicRoutes';

class Footer extends Component<any, any> {
	label = {
		cgvInclukathon: '© IncluKathon 2020',
		cgvInclusionConseil: '© Inclusion Conseil 2021',
		cgv: 'Mentions légales et Politique de Confidentialité',
		subLogoP: 'La différence comme source de performance',
	};

	constructor(props) {
		super(props);
		this.goToLink = this.goToLink.bind(this);
	}

	isContactPage() {
		return this.props.location.pathname.includes(contactPath);
	}

	isLoginPage() {
		return this.props.location.pathname.includes(appLoggedPath);
	}

	goToLink(link: string) {
		window.open(link, '_blank');
	}

	renderCopyrightPart() {
		const websiteLabel = this.label.cgvInclukathon;
		return (
			<p className={'align-center cgv'}>
				<a className={'d-none d-lg-block'} href={'/cgv'}>
					{websiteLabel} / {this.label.cgv}
				</a>
				<a className={'d-lg-none'} href={'/cgv'}>
					{websiteLabel} <br /> {this.label.cgv}
				</a>
			</p>
		);
	}

	renderLeftPart() {
		let extraClass = this.isContactPage() ? ' is-contact-page ' : '';
		extraClass += this.isLoginPage() ? ' is-login-page ' : '';
		const emailInclukathon = 'contact@inclukathon.com';
		return (
			<div className={'align-left'}>
				<div className={'contact-us-slogan ' + extraClass}>
					<p className={'footer-title'}>
						{' '}
						Prêt·e·s à challenger ? <span className={'d-none d-lg-inline'}>Contactez-nous</span>{' '}
					</p>
					<p className={'slogan d-lg-none'}>" La différence comme source de performance "</p>
					<button
						className="btn-brand-sub-text btn d-lg-none"
						type="submit"
						onClick={() => this.props.history.push(contactPath)}
					>
						Contactez-nous
					</button>
				</div>
				<p className={'d-none d-lg-block'}>
					<a className={'phone-icon'} href="tel:+33649295437">
						<FontAwesomeIcon icon={['fas', 'phone']} /> Tél. : 06 49 29 54 37 <br />
					</a>
					<a href={`mailto:${emailInclukathon}`}>
						<FontAwesomeIcon icon={['fas', 'envelope']} /> Email : &nbsp;{emailInclukathon}
					</a>
				</p>
			</div>
		);
	}

	renderRightPart() {
		return (
			<div className={'align-right follow-us'}>
				<p className={'align-right'}>Suivez-nous&nbsp;:</p>
				<FontAwesomeIcon
					icon={['fab', 'linkedin']}
					onClick={() => {
						this.goToLink('https://www.linkedin.com/company/inclukathon');
					}}
				/>
				<FontAwesomeIcon
					icon={['fab', 'youtube']}
					onClick={() => {
						this.goToLink('https://www.youtube.com/channel/UCJizR3dmm1FyV2h07nGpVtA?view_as=subscriber');
					}}
				/>
				<FontAwesomeIcon
					icon={['fab', 'instagram-square']}
					onClick={() => {
						this.goToLink('https://instagram.com/inclukathon?igshid=w0c2z5rag9v7');
					}}
				/>
			</div>
		);
	}

	render(): JSX.Element {
		let extraClass = this.isContactPage() ? ' is-contact-page ' : '';
		extraClass += this.isLoginPage() ? ' is-login-page ' : '';
		return (
			<div className={'footer-container' + extraClass}>
				<div className={'position-relative d-lg-flex justify-content-between'}>
					{this.renderLeftPart()}
					{this.renderRightPart()}
				</div>
				{this.renderCopyrightPart()}
			</div>
		);
	}
}

export default withRouter(Footer);

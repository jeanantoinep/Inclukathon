import * as React from 'react';
import Page from './Page';
import './ContactPage.scss';
import {withRouter} from 'react-router-dom';
import {ContactMailDto} from '../../server/src/email/contact.mail.dto';
import {HttpRequester} from '../utils/HttpRequester';
import {EMAIL_CTRL} from '../../server/src/provider/routes.helper';

class ContactPage extends Page<any, ContactMailDto> {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			company: '',
			email: '',
			phone: '',
			message: '',
			'gestion-projet': false,
			'cellule-ecoute': false,
			sensibilisation: false,
			'job-coaching': false,
			inclukathon: false,
			incluscore: false,
			inclucard: false,
		};
	}

	handleChange = (key, value) => {
		const update = {};
		update[key] = value;
		this.setState(update);
	};

	isValidEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	renderContactModalSent() {
		return (
			<div
				className="modal fade"
				id="modal-message-sent"
				tabIndex={-1}
				role="dialog"
				aria-labelledby="modal-message-sent"
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Contact
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">Votre demande de contact à bien été envoyée.</div>
					</div>
				</div>
			</div>
		);
	}

	sendMsg = async (e, contactMailDto: ContactMailDto) => {
		e.preventDefault();
		await HttpRequester.postHttp(EMAIL_CTRL + '/contact', contactMailDto);
		window.$('#modal-message-sent').modal('show');
		window.$('#modal-message-sent').on('hidden.bs.modal', () => (window.location.href = '/'));
	};

	isValidForm = (contactMailDto: ContactMailDto) => {
		return (
			this.isValidEmail(contactMailDto.email) &&
			contactMailDto.firstName.trim() != '' &&
			contactMailDto.lastName.trim() != '' &&
			contactMailDto.message.trim() != ''
		);
	};

	render(): JSX.Element {
		return (
			<>
				{this.renderContactModalSent()}
				<div className={'row page-left-right contact-page'}>
					<div className={'col-lg-6'}>
						<div className={'left-content mobile-centered-text'}>
							<img
								draggable={false}
								className={'contact-illustration d-block d-lg-none'}
								src={'/img/commercial/Illustration_11.svg'}
								alt={'brand-illustration'}
							/>
							<h1 className={'main-contact-title'}>Qu'Inclurons-nous&nbsp;?</h1>
							<h1 className={'d-none d-lg-block'}>Contactez-nous&nbsp;!</h1>
							<p className={'d-block d-lg-none'}>
								C’est le moment de challenger. Que votre projet soit déjà abouti ou au stade de la
								réflexion, décrivez-nous vos objectifs, vos attentes et comment vous l’imaginez !
							</p>
							<p className={'d-block d-lg-none'}>
								Tél.&nbsp;: +33 (0)6 49 29 54 37 <br /> Mail&nbsp;: contact@inclukathon.com
							</p>
							<img
								draggable={false}
								className={'contact-illustration d-none d-lg-block'}
								src={'/img/commercial/Illustration_11.svg'}
								alt={'brand-illustration'}
							/>
						</div>
					</div>
					<div className={'col-lg-6'}>
						<div className={'right-content'}>
							<form onSubmit={(e) => e.preventDefault()}>
								<div className="form-group">
									<input
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                            ${this.state.firstName.trim().length > 1 ? 'is-valid' : ''}
                                        `}
										required
										type="text"
										name={'given-name'}
										autoComplete={'given-name'}
										id="given-name"
										placeholder="Prénom"
										value={this.state.firstName}
										onChange={(e) => this.handleChange('firstName', e.target.value)}
									/>
								</div>
								<div className="form-group">
									<input
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                            ${this.state.lastName.trim().length > 1 ? 'is-valid' : ''}
                                        `}
										required
										type="text"
										name={'family-name'}
										autoComplete={'family-name'}
										id="family-name"
										placeholder="Nom de famille"
										value={this.state.lastName}
										onChange={(e) => this.handleChange('lastName', e.target.value)}
									/>
								</div>
								<div className="form-group">
									<input
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                        `}
										type="text"
										name={'organization'}
										autoComplete={'organization'}
										id="organization"
										placeholder="Entreprise"
										value={this.state.company}
										onChange={(e) => this.handleChange('company', e.target.value)}
									/>
								</div>
								<div className="form-group">
									<input
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                            ${this.isValidEmail(this.state.email) ? 'is-valid' : ''}
                                        `}
										required
										type="email"
										id="email"
										name={'email'}
										autoComplete={'email'}
										placeholder="Email"
										value={this.state.email}
										onChange={(e) => this.handleChange('email', e.target.value)}
									/>
								</div>
								<div className="form-group">
									<input
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                        `}
										type="phone"
										id="phone"
										name={'phone'}
										autoComplete={'tel'}
										placeholder="Téléphone"
										value={this.state.phone}
										onChange={(e) => this.handleChange('phone', e.target.value)}
									/>
								</div>
								<div className="form-group">
									<textarea
										value={this.state.message}
										className={`
                                            form-control
                                            form-control-lg
                                            round-lg
                                        `}
										name="message"
										id="message"
										cols={30}
										rows={10}
										placeholder="Dites-nous en plus"
										onChange={(e) => this.handleChange('message', e.target.value)}
									/>
								</div>
								<button
									disabled={!this.isValidForm(this.state)}
									onClick={(e) =>
										this.sendMsg(e, {
											...this.state,
										})
									}
									className="btn btn-outline-success my-2 my-sm-0 btn-all-colors"
									type="submit"
								>
									Envoyer
								</button>
							</form>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(ContactPage);

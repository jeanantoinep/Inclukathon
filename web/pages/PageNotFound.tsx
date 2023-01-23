import * as React from 'react';
import {Component} from 'react';
import './PageNotFound.scss';
import * as Sentry from '@sentry/react';
import {incluscoreAppPath, incluscoreLoginPath} from '../routes/incluscoreAppRoutes';

interface IProps extends IRouterProps {
	isErrorPage?: boolean;
}

export default class PageNotFound extends Component<IProps, any> {
	render() {
		return (
			<div className={'not-found-page'}>
				<img draggable={false} src={'/img/commercial/404.svg'} alt={'404'} className={'not-found-img'} />
				<p className={'c-liquorice score-title'}>Désolé•e la page que vous cherchez est introuvable.</p>
				<button
					className={'basic-btn mt-1'}
					onClick={() =>
						this.props.history.location.pathname.includes(incluscoreAppPath)
							? (window.location.href = incluscoreAppPath)
							: (window.location.href = '/')
					}
				>
					Retour à l'accueil
				</button>
			</div>
		);
	}

	componentDidMount() {
		if (!this.props.isErrorPage) {
			Sentry.captureMessage('Redirecting to "not found page", from: ' + window.location.href);
		} else {
			Sentry.captureMessage('Error page from path: ' + window.location.href);
		}
	}
}

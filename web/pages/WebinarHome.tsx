import {withRouter} from 'react-router-dom';
import * as React from 'react';
import {Component} from 'react';
import {HttpRequester} from '../utils/HttpRequester';
import {COMPANY_CTRL, WEBINAR_CTRL} from '../../server/src/provider/routes.helper';
import {WebinarDto} from '../../server/src/webinar/dto/webinar.dto';
import {hideLoader, showLoader} from '../index';
import {tr} from '../translations/TranslationsUtils';
import './WebinarHome.scss';
import {LoggedUserDto} from '../../server/src/user/dto/logged.user.dto';
import {incluscoreAppPath} from '../routes/incluscoreAppRoutes';
import AppLoginIn from './appSignIn/AppLoginIn';
import {CompanyDto} from '../../server/src/company/dto/company.dto';

interface IState {
	webinar: WebinarDto;
	user: LoggedUserDto;
	company: CompanyDto;
}

class WebinarHome extends Component<IRouterProps, IState> {
	constructor(props) {
		super(props);
		this.state = {
			webinar: null,
			user: window.connectedUser,
			company: null,
		};
	}

	handleSubmit = () => {
		// console.debug('value saved')
	};

	render() {
		const webinar = this.state.webinar;
		const user = this.state.user;
		if (!webinar) {
			return null;
		}
		if (user) {
			HttpRequester.postHttp(WEBINAR_CTRL + `/seen`, {
				idWebinar: this.state.webinar.id,
				idUser: this.state.user.id,
			}).then();
		}
		return (
			<div className={'webinar-home-page'}>
				<div className={'main-bloc'}>
					<h1 className={'webinar-title'}>{tr(webinar, 'title')}</h1>
					<p>{tr(webinar, 'description')}</p>
					{this.state.user && (
						<div>
							<video style={{maxWidth: '100%'}} controls src={'/webinar-video/' + webinar.path} />
						</div>
					)}
					{!this.state.user && (
						<AppLoginIn
							company={this.state.company}
							incluscoreAppGoTo={(pathname: string, additionalSearch?: string, refresh?: boolean) => {
								if (refresh) {
									return (window.location.href = pathname + window.location.search);
								}
								this.props.history.push({
									pathname,
									state: this.state,
									search: window.location.search,
								});
							}}
							defaultTeamId={this.state.company.teams && this.state.company.teams[0].id}
							isWebinar={true}
						/>
					)}
					<img
						draggable={false}
						src={`/img/incluscore-app/guys/${1}.svg`}
						className={'guy-1-bg'}
						alt={'illustration'}
					/>
					<img
						draggable={false}
						src={`/img/incluscore-app/guys/${2}.svg`}
						className={'guy-2-bg'}
						alt={'illustration'}
					/>
				</div>
			</div>
		);
	}

	setContext = () => {
		document.title = 'Webinar';
	};

	async componentDidMount() {
		showLoader(this.constructor.name);
		this.setContext();
		const {idWebinar} = this.props.match.params;
		const webinar: WebinarDto = await HttpRequester.getHttp(WEBINAR_CTRL + '/home/' + idWebinar);
		const company: CompanyDto = await HttpRequester.getHttp(COMPANY_CTRL + '/' + webinar.company.id);
		hideLoader(this.constructor.name);
		if (!webinar) {
			return (window.location.href = incluscoreAppPath + '/not-found-webinar');
		}
		this.setState({
			webinar,
			company,
		});
	}
}
export default withRouter(WebinarHome);

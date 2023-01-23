import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Component} from 'react';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {USER_CTRL, WEBINAR_CTRL} from '../../../../server/src/provider/routes.helper';
import {createWebinarAdminPath} from '../../../routes/adminRoutes';
import {WebinarDto} from '../../../../server/src/webinar/dto/webinar.dto';
import {webinarHomePath} from '../../../routes/webinarRoutes';
import {ToastHelper} from '../../../basics/ToastHelper';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {DateTimeHelper} from '../../../../server/src/helper/DateTimeHelper';
import {incluscoreHomePath} from '../../../routes/incluscoreAppRoutes';

type IProps = IRouterProps;

class WebinarListPage extends Component<IProps, {webinarList: WebinarDto[]; users: UserDto[]}> {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			webinarList: [],
		};
	}

	copyTextToClipboard = (text: string) => {
		if (!navigator.clipboard) {
			this.fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(
			() => {
				console.debug('Async: Copying to clipboard was successful!');
			},
			(err) => {
				console.error('Async: Could not copy text: ', err);
			},
		);
	};

	fallbackCopyTextToClipboard = (text: string) => {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');
			const msg = successful ? 'successful' : 'unsuccessful';
			console.debug('Fallback: Copying text command was ' + msg);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}

		document.body.removeChild(textArea);
	};

	renderSingleWebinar(webinar: WebinarDto) {
		const editUrl = createWebinarAdminPath;
		const history = this.props.history;
		const nbSeen = this.state.users.filter((u) => u.webinars?.find((wId) => wId.id === webinar.id))?.length;
		return (
			<>
				<td>
					<p> {webinar.title} </p>
				</td>
				<td>
					<p>
						<span className={`${webinar.isInProgress ? '' : 'not-enabled'}`}>
							{webinar.formattedStartDate}
							{webinar.formattedStartDate && ' au '}
							{webinar.formattedEndDate}
						</span>
					</p>
				</td>
				<td>
					<p>
						<span className={`${webinar.enabled ? '' : 'not-enabled'}`}>
							{webinar.enabled ? 'Oui' : 'Non'}
						</span>
					</p>
				</td>
				<td>
					<p> {webinar.description} </p>
				</td>
				<td>
					<div>
						<video style={{maxWidth: '100%'}} controls src={'/webinar-video/' + webinar.path} />
					</div>
				</td>
				<td>
					<button
						className={'btn btn-primary btn-to-launch pointer'}
						onClick={() => {
							window.open(window.origin + webinarHomePath + `/${webinar.id}`, '_blank');
						}}
					>
						Lien
					</button>
				</td>
				<td>
					<button
						className={'btn btn-primary btn-to-launch pointer'}
						onClick={() => {
							this.copyTextToClipboard(window.origin + webinarHomePath + `/${webinar.id}`);
							ToastHelper.showSuccessMessage('Copié dans le presse papier !');
						}}
					>
						Copier
					</button>
				</td>
				<td>
					<button
						className={'btn btn-primary btn-to-launch pointer'}
						onClick={() =>
							history.push({
								pathname: editUrl + `/${webinar.id}`,
							})
						}
					>
						Modifier
					</button>
				</td>
				<td>
					<p>{isNaN(nbSeen) ? 0 : nbSeen} Utilisateurs ont vu le webinar</p>
				</td>
			</>
		);
	}

	render() {
		const webinarList = this.state.webinarList;
		const history = this.props.history;
		const editUrl = createWebinarAdminPath;
		return (
			<div className={'manage-company-page'}>
				<div>
					<button
						className={'d-block btn btn-success btn-new ml-auto mr-0'}
						onClick={() => history.push({pathname: editUrl})}
					>
						Nouveau webinar
					</button>
				</div>
				<table className={'admin-table not-clickable'}>
					<thead>
						<tr className={''}>
							<th>Titre</th>
							<th>Dates</th>
							<th>Activé</th>
							<th>Description</th>
							<th>Video</th>
							<th>Voir le webinar</th>
							<th>Copier lien pour partager</th>
							<th>Actions</th>
							<th>Nombres de visionnages</th>
						</tr>
					</thead>
					<tbody>
						{webinarList.length > 0 &&
							webinarList.map((webinar, index) => {
								return <tr key={index}>{this.renderSingleWebinar(webinar)}</tr>;
							})}
					</tbody>
				</table>
			</div>
		);
	}

	async componentDidMount() {
		showLoader(this.constructor.name);
		const webinarList: WebinarDto[] = await HttpRequester.getHttp(WEBINAR_CTRL);
		const users: UserDto[] = await HttpRequester.getHttp(USER_CTRL);
		hideLoader(this.constructor.name);
		this.setState({webinarList, users});
	}
}
export default withRouter(WebinarListPage);

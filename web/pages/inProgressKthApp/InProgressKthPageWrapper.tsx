import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as React from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import './InProgressKthPageWrapper.scss';
import {loginPath} from '../../routes/publicRoutes';
import AccountPage from '../AccountPage';
import {HttpRequester} from '../../utils/HttpRequester';
import {LOGIN_CTRL} from '../../../server/src/provider/routes.helper';
import {hideLoader, showLoader} from '../../index';
import {TrombiHelper} from '../../components/trombiComponents/TrombiHelper';
import {UserDto} from '../../../server/src/user/dto/user.dto';
import {MessageParams, MsgSoloBox} from '../../components/chat/MsgSoloBox';

declare const io: any;

interface IProps extends IRouterProps {
	accessibleWithoutInProgressKth?: boolean;
	refreshUser?: boolean;
}

interface IState {
	myTeamsMsg: MessageParams[];
	refreshDone: boolean;
	socket: any;
}

class InProgressKthPageWrapper extends Component<IProps, IState> {
	CHAT_DEV_ENABLED = false;

	constructor(props) {
		super(props);
		this.state = {
			refreshDone: false,
			myTeamsMsg: [],
			socket: this.CHAT_DEV_ENABLED && (io as any)('http://localhost:8080'),
		};
	}

	redirectToLoginPage() {
		this.props.history.push({pathname: loginPath});
	}

	render() {
		if (!window.connectedUser || (!this.state.refreshDone && this.props.refreshUser)) {
			return null;
		}
		const {currentInclukathon, company, team} = window.connectedUser;
		const child: any =
			currentInclukathon || this.props.accessibleWithoutInProgressKth ? this.props.children : <AccountPage />;
		return (
			<>
				{currentInclukathon?.bannerImgPath && (
					<img
						className={'img-banner-kth'}
						src={'/inclukathon-banner/' + currentInclukathon?.bannerImgPath}
						alt={'bandeau'}
					/>
				)}
				<div className={`kth-app-wrapper pb-5 ${!currentInclukathon?.bannerImgPath && 'no-banner-kth'}`}>
					{React.cloneElement(child, {
						company,
						inclukathon: currentInclukathon,
						currentTeam: team,
						history: this.props.history,
						location: this.props.location,
						match: this.props.match,
					} as InProgressKthWrapperProps)}
				</div>
				{currentInclukathon && this.CHAT_DEV_ENABLED && (
					<div
						className={'tchat-component d-flex'}
						style={{bottom: 0, right: 0, position: 'fixed', gap: '1rem'}}
					>
						<MsgSoloBox
							socket={this.state.socket}
							chatType={'MY_TEAM'}
							incomingMessages={this.state.myTeamsMsg}
						/>
						<div
							className={'msg-main-box-component'}
							style={{
								marginRight: '1rem',
								backgroundColor: '#FFF',
								border: 'solid 1px grey',
								borderTopLeftRadius: '8px',
								borderTopRightRadius: '8px',
								borderBottom: 'none',
							}}
						>
							<div
								className={'header-msg-main-box d-flex'}
								style={{
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: '1rem',
								}}
							>
								<div className={'d-flex align-items-center'}>
									<div style={{maxWidth: '35px'}}>
										{TrombiHelper.showUserImg(window.connectedUser as UserDto, false)}
									</div>
									<div>Messagerie</div>
								</div>
								<div className={'d-flex align-items-center'}>
									<div>+</div>
									<div>X</div>
								</div>
							</div>
							<div
								className={'sub-header'}
								style={{
									borderTop: 'solid 1px grey',
									borderBottom: 'solid 1px grey',
									padding: '1rem',
									paddingTop: '.5rem',
									paddingBottom: '.5rem',
									textAlign: 'center',
								}}
							>
								Qui souhaitez-vous contacter ?
							</div>
							<div className={'content-msg-main-box'}>
								<span className={'d-block'}>mon equipe (nom)</span>
								<span className={'d-block'}>equipe + coach</span>
								<span className={'d-block'}>equipe + jury</span>
								<span className={'d-block'}>equipe + coach + jury</span>
								<span className={'d-block'}>Recherche par nom</span>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	connectToWs() {
		if (!this.CHAT_DEV_ENABLED) {
			return;
		}
		//console.debug('connectToWs');
		// this.socket = io('https://example.com', {
		// 	key: readFileSync('/path/to/client-key.pem'),
		// 	cert: readFileSync('/path/to/client-cert.pem'),
		// 	ca: [readFileSync('/path/to/server-cert.pem')],
		// });
		//console.debug(this.state.socket);
		this.state.socket.on('connect', () => {
			//console.debug('Connected');
			this.state.socket.emit('events', {message: 'test'});
			this.state.socket.emit('identity', 0, (response) => console.debug('Identity:', response));
		});
		this.state.socket.on('events', (data: MessageParams) => {
			//console.debug('event', data);
			if (data.chatType === 'MY_TEAM') {
				this.setState({myTeamsMsg: [...this.state.myTeamsMsg, data]});
			}
			(document.querySelector('.msg-list-container') as HTMLDivElement).scrollTo(0, 999999);
		});
		this.state.socket.on('exception', (data) => {
			console.debug('event', data);
		});
		this.state.socket.on('disconnect', () => {
			console.debug('Disconnected');
		});
	}

	async componentDidMount() {
		if (!window.connectedUser) {
			return this.redirectToLoginPage();
		}
		if (this.props.refreshUser) {
			showLoader(this.constructor.name);
			window.connectedUser = await HttpRequester.getHttp(LOGIN_CTRL);
			this.setState({refreshDone: true});
			hideLoader(this.constructor.name);
		}
		//this.connectToWs();
	}
}

export default withRouter(InProgressKthPageWrapper);

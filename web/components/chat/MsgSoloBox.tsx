import {Component} from 'react';
import * as React from 'react';
import './MsgSoloBox.scss';
import BasicInput from '../../basics/BasicInput';
import {TrombiHelper} from '../trombiComponents/TrombiHelper';
import * as OverlayScrollbars from 'overlayscrollbars';

export interface MessageParams {
	message: string;
	chatType: string;
	userId: string;
	teamId: string;
}

interface IProps {
	socket: any;
	chatType: string;
	incomingMessages: MessageParams[];
}

interface IState {
	currentMsg: string;
	oScrollbar: any;
}

export class MsgSoloBox extends Component<IProps, IState> {
	constructor(props) {
		super(props);
		this.state = {
			currentMsg: '',
			oScrollbar: {},
		};
	}

	render() {
		return (
			<div className={'msg-solo-box-component'}>
				<div className={'header-msg-main-box'}>
					<div className={'d-flex align-items-center'}>
						<div>Mon équipe</div>
					</div>
					<div className={'d-flex align-items-center'}>
						<div>+</div>
						<div>X</div>
					</div>
				</div>
				<div className={'sub-header'}>A B C D E F</div>
				<div className={'d-flex justify-content-between flex-column'}>
					<div className={'msg-list-container'}>
						<div>
							{this.props.incomingMessages.map((msgParam: MessageParams, i) => (
								<div
									key={i}
									className={`d-flex ${
										window.connectedUser.id === msgParam.userId ? 'flex-row-reverse' : 'flex-row'
									}`}
								>
									<div style={{maxWidth: '35px', marginTop: '.5rem'}}>
										{TrombiHelper.showUserImg(
											window.connectedUser.company.users.find((u) => u.id === msgParam.userId),
											false,
										)}
									</div>
									<div
										className={`msg-bubble ${
											window.connectedUser.id === msgParam.userId
												? 'msg-bubble-right'
												: 'msg-bubble-left'
										} ${window.connectedUser.id} ${msgParam.userId}`}
									>
										<p className={'user-name'}>
											{window.connectedUser.firstName} {window.connectedUser.lastName}
										</p>
										{msgParam.message}
									</div>
								</div>
							))}
						</div>
					</div>
					<div className={'d-flex'}>
						<BasicInput
							label={' '}
							type={'textarea'}
							inputName={'currentMsg'}
							value={this.state.currentMsg}
							change={(e) => {
								this.setState({currentMsg: e});
							}}
							onKeyPress={this.handleKeyPress}
						/>
						<div onClick={this.sendMessage}>submit</div>
					</div>
				</div>
			</div>
		);
	}

	sendMessage = () => {
		if (this.state.currentMsg.trim() === '') {
			return;
		}
		this.props.socket.emit('events', {
			chatType: this.props.chatType,
			teamId: window.connectedUser.team.id,
			userId: window.connectedUser.id,
			message: this.state.currentMsg,
		} as MessageParams);
		setTimeout(() => {
			this.scrollMsgToBottom();
		}, 50);
		this.setState({currentMsg: ''});
	};

	handleKeyPress = (event) => {
		if (event.key === 'Enter' && event.shiftKey == false) {
			event.preventDefault();
			this.sendMessage();
		}
	};

	scrollMsgToBottom = () => {
		this.state.oScrollbar.scroll({top: 999999999}, 100, 'linear');
	};

	componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
		if (prevProps.incomingMessages?.length !== this.props.incomingMessages?.length) {
			setTimeout(() => {
				this.scrollMsgToBottom();
			}, 50);
		}
	}

	componentDidMount() {
		const oScrollbar = OverlayScrollbars(document.querySelectorAll('.msg-list-container'), {});
		this.setState({oScrollbar});
	}
}

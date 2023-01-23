import * as React from 'react';
import {Component} from 'react';
import BasicInput from '../basics/BasicInput';
import './AccountPage.scss';
import {UserDto} from '../../server/src/user/dto/user.dto';
import {HttpRequester} from '../utils/HttpRequester';
import {SaveUserDto} from '../../server/src/user/dto/save.user.dto';
import {FilePondInput} from '../fileManager/FilePondInput';
import {ACCOUNT_PAGE_AVATAR_UPLOAD, ACCOUNT_PAGE_PRESENTATION_VIDEO_UPLOAD} from '../utils/FileUploaderHelper';
import {TeamDto} from '../../server/src/team/dto/team.dto';
import {LoggedUserDto} from '../../server/src/user/dto/logged.user.dto';
import {TrombiHelper} from '../components/trombiComponents/TrombiHelper';
import {UserPresentationModal} from '../components/trombiComponents/UserPresentationModal';
import {COMPANY_CTRL, USER_CTRL} from '../../server/src/provider/routes.helper';
import {DeliverablesListComponent} from '../components/deliveryComponents/DeliverablesListComponent';
import {InProgressKthWrapperProps} from '../typings/in-progress-kth-app';
import {ProjectDescriptionAccount} from '../components/accountComponent/ProjectDescriptionAccount';
import {ToastHelper} from '../basics/ToastHelper';
import LoginPage from './LoginPage';

// see u-ktn-avatar css width
const INCLUKATHON_USER_AVATAR_WIDTH = 200;

interface IState extends LoggedUserDto {
	currentUserModal: UserDto | null;
}

export default class AccountPage extends Component<InProgressKthWrapperProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			...window.connectedUser,
			currentUserModal: null,
		};
	}

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);

		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.saveUser(), this.saveRequestTimeoutValue);
	};

	saveUser = async () => {
		await HttpRequester.postHttp(USER_CTRL, {...this.state} as SaveUserDto);
		ToastHelper.showSuccessMessage();
	};

	renderMyTeam(myTeam: TeamDto): JSX.Element {
		const teamUsers = this.state.company.users?.filter((u) => u.team.id === myTeam.id);
		const managers = this.props.company?.users?.filter((u) => u?.manageTeams?.find((t) => t?.id === myTeam?.id));
		return (
			<>
				<div className={'d-flex flex-row m-auto'}>
					<div
						className={'desktop-small-column'}
						style={{
							padding: '1rem',
							paddingRight: '3rem',
						}}
					>
						<h1>Équipe {myTeam.name}</h1>
						<ProjectDescriptionAccount
							initialProjectDescription={myTeam.projectDescription}
							idTeam={myTeam.id}
						/>
						<h3>Coach référent:</h3>
						<p>{managers.map((m) => `${m.firstName} ${m.lastName}`)?.join(', ')}</p>
					</div>
					<div className={'desktop-long-column'}>
						<h1> Les membres de vôtre équipe </h1>
						<div className={'account-team-pictures-container'}>
							{TrombiHelper.showUsersListAsTrombi(teamUsers, this.setUserModalAndOpen)}
						</div>
						<UserPresentationModal user={this.state.currentUserModal} />
					</div>
				</div>
			</>
		);
	}

	setUserModalAndOpen = (u: UserDto) => {
		this.setState({
			currentUserModal: u,
		});
		UserPresentationModal.openModal();
	};

	displayIdentityOfCurrentUser() {
		const user = this.state;
		const isJury = user.juryOfTeams?.length > 0;
		const isManager = user.manageTeams?.length > 0;
		const isCompanyAdmin = user.isCompanyAdmin;
		const pClass = 'mt-3';
		if (isJury) {
			return <p className={pClass}>Jury</p>;
		}
		if (isManager) {
			return <p className={pClass}>Coach</p>;
		}
		if (isCompanyAdmin) {
			return <p className={pClass}>Organisateur IncluKathon</p>;
		}
		return <p className={pClass}>Équipe {this.state.team.arborescence}</p>;
	}

	renderAccountInfos() {
		const user = this.state;
		return (
			<div className={'user-main-infos'}>
				<div className={'avatar-and-main-user-infos desktop-long-column'}>
					<h1>Mon profil</h1>
					<div className={'my-profil-bloc'}>
						<div className={'left-account-side w-100 align-center'}>
							<FilePondInput
								id={'current-user-avatar'}
								squareSideLength={INCLUKATHON_USER_AVATAR_WIDTH}
								idToAssignToFilename={this.state.id}
								loadImage={false}
								filesPath={this.state.avatarImgPath ? [this.state.avatarImgPath] : null}
								apiUrl={ACCOUNT_PAGE_AVATAR_UPLOAD}
								imageCropAspectRatio={'1:1'}
								stylePanelLayout={'compact circle'}
								filenameSuffix={'user-picture'}
								keepOriginalFileName={true}
								typeOfFileExpected={'image/*'}
								extraBodyParams={[
									{
										key: 'idUser',
										value: user.id,
									},
								]}
							/>
							{this.displayIdentityOfCurrentUser()}
						</div>
						<div className={'d-flex flex-column right-account-side w-100'}>
							<BasicInput
								label={'Prénom'}
								inputName={'firstName'}
								value={this.state.firstName}
								type="text"
								change={this.handleValue}
							/>
							<BasicInput
								label={'Nom'}
								inputName={'lastName'}
								value={this.state.lastName}
								type="text"
								change={this.handleValue}
							/>
							<BasicInput
								label={'Poste'}
								inputName={'jobName'}
								value={this.state.jobName}
								type="text"
								change={this.handleValue}
							/>
							<BasicInput
								label={"Nom de l'organisation"}
								inputName={'squadName'}
								value={this.state.squadName}
								type="text"
								change={this.handleValue}
							/>
							<BasicInput
								label={'Email'}
								inputName={'email'}
								value={this.state.email}
								type="text"
								change={this.handleValue}
								disabled={true}
							/>
						</div>
					</div>
				</div>
				<div className={'presentation-video-user-component-container desktop-small-column'}>
					{this.renderUserVideoFileUploader()}
				</div>
			</div>
		);
	}

	renderUserVideoFileUploader() {
		const user = this.state;
		return (
			<>
				<h1>Vidéo de présentation</h1>
				<div className={'m-auto w-100'}>
					<FilePondInput
						id={'user-video-presentation'}
						loadImage={false}
						filesPath={user.presentationVideoPath ? [user.presentationVideoPath] : []}
						idToAssignToFilename={user.id}
						apiUrl={ACCOUNT_PAGE_PRESENTATION_VIDEO_UPLOAD}
						filenameSuffix={'user-video-presentation'}
						keepOriginalFileName={true}
						typeOfFileExpected={'video/*'}
						allowImagePreview={true}
						extraBodyParams={[
							{
								key: 'idUser',
								value: user.id,
							},
						]}
					/>
				</div>
			</>
		);
	}

	disconnect = () => {
		LoginPage.logout();
		this.props.history.push('/');
	};

	render(): JSX.Element {
		const user = this.state;
		return (
			<div className={'account-page'}>
				{this.renderAccountInfos()}
				{user.juryOfTeams?.length > 0 ? null : (
					<div key={this.state.team.id}>
						<hr />
						{this.renderMyTeam(this.state.team)}
						<hr />
						<h1> Livrables de l'équipe </h1>
						<DeliverablesListComponent {...this.props} idTeam={this.state.team.id} />
					</div>
				)}
				<button className="btn btn-outline-success mt-5 mb-2 btn-all-colors" onClick={() => this.disconnect()}>
					Se déconnecter
				</button>
			</div>
		);
	}

	async componentDidMount() {
		const company = await HttpRequester.getHttp(`${COMPANY_CTRL}/${this.state.company.id}`);
		this.setState({
			company,
		});
	}
}

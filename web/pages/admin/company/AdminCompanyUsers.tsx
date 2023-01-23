/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {createCompanyUsersAdminPath} from '../../../routes/adminRoutes';
import {USER_CTRL} from '../../../../server/src/provider/routes.helper';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {UserThemeDto} from '../../../../server/src/incluscore/dto/user-theme.dto';
import {ThemeDto} from '../../../../server/src/incluscore/dto/theme.dto';
import {TrombiHelper} from '../../../components/trombiComponents/TrombiHelper';
import {UsersToXlsx} from '../../../jsonToXlsx/UsersToXlsx';
import {WebinarDto} from '../../../../server/src/webinar/dto/webinar.dto';

const xlsx = require('json-as-xlsx');

interface IAdminCompanyUsersProps extends IRouterProps {
	companyId: string;
	companyTeams: TeamDto[];
	companyUsers: UserDto[];
	launchesScr: LaunchIncluscoreDto[];
}

interface AdminCompanyUsersState {
	companyUsers: UserDto[];
	usersFragmented: UserDto[];
}

class AdminCompanyUsers extends Component<IAdminCompanyUsersProps, AdminCompanyUsersState> {
	filteredUserThemes: UserThemeDto[] = [];
	webinarsSeen: WebinarDto[] = this.props.companyUsers
		.map((u) => u.webinars)
		.reduce((previousWebinarList, webinarList) => {
			if (!webinarList) {
				return previousWebinarList;
			}
			for (const webinar of webinarList) {
				if (!previousWebinarList.find((w) => w.id === webinar.id)) {
					previousWebinarList.push(webinar);
				}
			}
			return previousWebinarList;
		}, []);

	constructor(props) {
		super(props);
		this.filteredUserThemes = this.getFilteredUserThemes(); // has to be BEFORE sortUsers
		this.state = {
			companyUsers: this.sortUsers(this.props.companyUsers),
			usersFragmented: [],
		};
	}

	getFilteredUserThemes = () => {
		const userThemes: UserThemeDto[] = [];
		for (const launch of this.props.launchesScr) {
			if (launch.idIncluscore?.themes?.length > 0) {
				for (const theme of launch.idIncluscore.themes) {
					for (const userTheme of launch.userThemes) {
						if (
							!userThemes.find((u) => u.themeId.id === theme.id && u.userId.id === userTheme.userId.id) &&
							userTheme.themeId.id === theme.id &&
							userTheme.score > 0 &&
							this.props.companyUsers.find((user) => user.id === userTheme.userId.id)
						) {
							userThemes.push(userTheme);
						}
					}
				}
			}
		}
		return userThemes;
	};

	public static retrieveScoreStatic = (
		launchesScr: LaunchIncluscoreDto[],
		ownUserThemes: UserThemeDto[],
		user: UserDto,
		intValueOnly: boolean,
		onlyThemeWithId?: string,
	): number | string | JSX.Element => {
		if (!launchesScr) {
			return intValueOnly ? -1 : <span className={'not-enabled'}> Non répondu </span>;
		}
		if (onlyThemeWithId) {
			const ut = ownUserThemes.find((ut) => ut.themeId.id === onlyThemeWithId && ut.userId.id === user.id);
			if (!ut) {
				for (const launch of launchesScr) {
					if (launch.userThemes.find((ut) => ut.themeId.id === onlyThemeWithId && ut.userId.id === user.id)) {
						return '0';
					}
				}
			}
			const noResponseYet = intValueOnly ? -1 : <span className={'not-enabled'}> Non répondu </span>;
			return ut ? (intValueOnly ? ut.score : ut.score.toString()) : noResponseYet;
		}
		let score = 0;
		const webinarScore = user.webinars?.map((w) => w.score)?.reduce((a, b) => a + b);
		score = !isNaN(webinarScore) && webinarScore > 0 ? webinarScore : score;
		for (const userTheme of ownUserThemes) {
			if (userTheme.userId.id === user.id) {
				score += userTheme?.score || 0;
			}
		}
		return intValueOnly ? score : score.toString();
	};

	retrieveTotalScoreForOneUser = (
		ownUserThemes: UserThemeDto[],
		user: UserDto,
		intValueOnly = false,
		onlyThemeWithId?: string,
	): number | string | JSX.Element => {
		return AdminCompanyUsers.retrieveScoreStatic(
			this.props.launchesScr,
			ownUserThemes,
			user,
			intValueOnly,
			onlyThemeWithId,
		);
	};

	removeUser = async (e, user: UserDto) => {
		e.stopPropagation();
		if (!window.confirm("Supprimer définitivement l'utilisateur ?")) {
			return;
		}
		const companyUsers = await HttpRequester.deleteHttp(USER_CTRL, {
			userId: user.id,
			companyId: this.props.companyId,
		});
		this.setState({
			companyUsers: this.state.companyUsers.filter((user) => companyUsers.find((u) => u.id === user.id)),
		});
		this.initPagination();
	};

	renderSingleUser(user: UserDto) {
		if (!user) {
			return null;
		}
		const hasFirstName = user.firstName && user.firstName.trim() !== '';
		const hasLastName = user.lastName && user.lastName.trim() !== '';
		const ownUserThemes = this.filteredUserThemes.filter((ut) => ut.userId.id === user.id);
		return (
			<>
				<td>
					<div className={'m-auto in-admin-list-trombi'} style={{maxWidth: '30%'}}>
						{TrombiHelper.showUserImg(user)}
					</div>
				</td>
				<td>
					{(hasFirstName || hasLastName) && (
						<p className={'m-0'}>
							{user.firstName} {user.lastName}{' '}
							{user.studentNumber ? `(Numéro d’étudiant: ${user.studentNumber})` : ''}
						</p>
					)}
					<p className={'m-0'}> {user.email} </p>
				</td>
				<td className="text-center">
					<p className={'m-0'}> {user.enabled ? 'Activé' : 'Non activé'} </p>
				</td>
				<td className="text-center">
					<p className={'mb-0'}>
						<span className={user.team?.enabled ? '' : 'not-enabled'}>{user.team?.arborescence}</span>
					</p>
				</td>
				<td className="text-center">
					<p className={'m-0'}>{this.retrieveTotalScoreForOneUser(ownUserThemes, user)}</p>
				</td>
				{AdminCompanyUsers.getOneUserThemeForEachThemeIds(this.filteredUserThemes).map((theme) => (
					<td className="text-center" key={theme.id}>
						<p className={'m-0'}>
							{this.retrieveTotalScoreForOneUser(ownUserThemes, user, false, theme.id)}
						</p>
					</td>
				))}
				{this.webinarsSeen.map((webinar) => (
					<td className="text-center" key={webinar.id}>
						<p className={'m-0'}>
							{user.webinars?.find((w) => w.id === webinar.id) ? (
								webinar.score
							) : (
								<span className={'not-enabled'}> Non vu </span>
							)}
						</p>
					</td>
				))}
				<td className="text-center">
					<FontAwesomeIcon icon={['fas', 'trash']} onClick={(e) => this.removeUser(e, user)} />
				</td>
			</>
		);
	}

	sortUsers = (users: UserDto[]) => {
		return users?.sort((userA, userB) => {
			const scoreA = this.retrieveTotalScoreForOneUser(this.filteredUserThemes, userA, true);
			const scoreB = this.retrieveTotalScoreForOneUser(this.filteredUserThemes, userB, true);
			return scoreA > scoreB ? -1 : 1;
		});
	};

	public static getOneUserThemeForEachThemeIds = (filteredUserThemes: UserThemeDto[]): ThemeDto[] => {
		const themes = [];
		for (const ut of filteredUserThemes) {
			if (themes.find((t: ThemeDto) => t.id === ut.themeId.id)) {
				continue;
			}
			themes.push(ut.themeId);
		}
		return themes;
	};

	render() {
		const editUrl = createCompanyUsersAdminPath + `/${this.props.companyId}/user/`;
		const displayNewStudentNumber = this.props.launchesScr.find((l) => l.idIncluscore.displayNewStudentNumber);
		return (
			<div className={'manage-company-users-page'}>
				<div className={'d-flex justify-content-end align-items-center mb-3'}>
					<div className={'mr-3'}>
						<button
							className={'btn btn-primary btn-all-colors'}
							onClick={() =>
								xlsx(
									UsersToXlsx.launchScrUsersToXlsx(
										this.props.companyUsers,
										displayNewStudentNumber,
										this.props.launchesScr,
										this.filteredUserThemes,
										this.props.companyTeams,
										this.webinarsSeen,
									),
									{
										fileName: 'utilisateurs',
										extraLength: 3,
										writeOptions: {},
									},
								)
							}
						>
							Exporter vers excel
						</button>
					</div>
					<button
						className={'btn btn-success btn-new'}
						onClick={() =>
							this.props.history.push({
								pathname: editUrl,
							})
						}
					>
						Nouvel utilisateur
					</button>
				</div>
				{this.state.usersFragmented && (
					<div>
						<div id="pagination-container" />
						<table className={'admin-table mb-4'}>
							<thead>
								<tr>
									<th>Logo</th>
									<th>Utilisateur</th>
									<th>Activée</th>
									<th>Team</th>
									<th>Score&nbsp;total</th>
									{AdminCompanyUsers.getOneUserThemeForEachThemeIds(this.filteredUserThemes).map(
										(theme) => (
											<th key={theme.id}>{theme.name}</th>
										),
									)}
									{this.webinarsSeen.map((webinar) => {
										return <th key={webinar.id}>{webinar.title}</th>;
									})}
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{this.state.usersFragmented.map((user: UserDto, index) => {
									const classEnabled = user.enabled ? '' : 'not-enabled';
									return (
										<tr
											key={index}
											className={classEnabled}
											onClick={() =>
												this.props.history.push({
													pathname: editUrl + user.id,
												})
											}
										>
											{this.renderSingleUser(user)}
										</tr>
									);
								})}
							</tbody>
						</table>
						<div id="pagination-container-end" />
					</div>
				)}
			</div>
		);
	}

	initSinglePagination(selector: string) {
		window.$(selector).pagination({
			dataSource: this.state.companyUsers,
			callback: (usersFragmented) => {
				this.setState({
					usersFragmented,
				});
			},
		});
	}

	initPagination() {
		this.initSinglePagination('#pagination-container');
		this.initSinglePagination('#pagination-container-end');
	}

	componentDidMount() {
		this.initPagination();
	}
}

export default withRouter(AdminCompanyUsers);

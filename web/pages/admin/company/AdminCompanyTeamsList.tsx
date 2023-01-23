import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {LaunchInclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/launch.inclukathon.dto';
import {createCompanyTeamsAdminPath} from '../../../routes/adminRoutes';
import {TEAM_CTRL} from '../../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../../basics/ToastHelper';

interface IAdminCompanyUsersProps extends IRouterProps {
	companyId: string;
	companyTeams: TeamDto[];
	companyUsers: UserDto[];
	launchesScr: LaunchIncluscoreDto[];
	launchesKth: LaunchInclukathonDto[];
}

interface AdminCompanyUsersState {
	companyTeams: TeamDto[];
	companyUsers: UserDto[];
}

class AdminCompanyTeams extends Component<IAdminCompanyUsersProps, AdminCompanyUsersState> {
	removeTeamLabel = "Supprimer définitivement l'équipe ?";

	constructor(props) {
		super(props);
		this.state = {
			companyTeams: this.props.companyTeams,
			companyUsers: this.props.companyUsers,
		};
	}

	removeTeam = async (e, team: TeamDto) => {
		e.stopPropagation();
		if (!window.confirm(this.removeTeamLabel)) {
			return;
		}
		const companyTeams = await HttpRequester.deleteHttp(TEAM_CTRL, {
			idTeam: team.id,
			idCompany: this.props.companyId,
		});
		this.setState({companyTeams});
		ToastHelper.showSuccessMessage();
	};

	renderSingleTeam(team: TeamDto) {
		if (!team) {
			return null;
		}
		return (
			<>
				<td>
					<p> {team.arborescence} </p>
				</td>
				<td>
					<FontAwesomeIcon icon={['fas', 'trash']} onClick={(e) => this.removeTeam(e, team)} />
				</td>
			</>
		);
	}

	render() {
		const editUrl = createCompanyTeamsAdminPath + `/${this.props.companyId}/team/`;
		return (
			<div>
				<button
					className={'btn btn-success btn-new'}
					onClick={() =>
						this.props.history.push({
							pathname: editUrl,
						})
					}
				>
					Nouvelle équipe
				</button>
				{this.state.companyTeams && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Nom</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.companyTeams.map((team: TeamDto, index) => {
								const classEnabled = team.enabled ? '' : 'not-enabled';
								return (
									<tr
										key={index}
										className={classEnabled}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl + team.id,
											})
										}
									>
										{this.renderSingleTeam(team)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}

export default withRouter(AdminCompanyTeams);

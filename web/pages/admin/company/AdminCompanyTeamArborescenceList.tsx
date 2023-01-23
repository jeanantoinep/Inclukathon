import {Component} from 'react';
import * as React from 'react';
import {createCompanyTeamArborescenceAdminPath} from '../../../routes/adminRoutes';
import {TeamArborescenceDto} from '../../../../server/src/company/dto/teamArborescence.dto';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HttpRequester} from '../../../utils/HttpRequester';
import {TEAM_CTRL} from '../../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../../basics/ToastHelper';
import {withRouter} from 'react-router-dom';

interface IProps extends IRouterProps {
	companyId: string;
	companyTeamArborescence: TeamArborescenceDto[];
}

interface IState {
	companyTeamArborescence: TeamArborescenceDto[];
}

class AdminCompanyTeamArborescenceList extends Component<IProps, IState> {
	removeTeamArborescenceLabel = "Supprimer définitivement le niveau d'arborescence ?";
	constructor(props) {
		super(props);
		this.state = {
			companyTeamArborescence: this.props.companyTeamArborescence,
		};
	}

	removeTeamArborescence = async (e, teamArborescence: TeamArborescenceDto) => {
		e.stopPropagation();
		if (!window.confirm(this.removeTeamArborescenceLabel)) {
			return;
		}
		const companyTeamArborescence = await HttpRequester.deleteHttp(TEAM_CTRL + '/arborescence', {
			idTeamArborescence: teamArborescence.id,
			idCompany: this.props.companyId,
		});
		this.setState({companyTeamArborescence});
		ToastHelper.showSuccessMessage();
	};

	renderTeamArborescence() {
		const editUrl = createCompanyTeamArborescenceAdminPath + `/${this.props.companyId}/team-arborescence/`;
		return (
			<div className={'manage-company-teams-page'}>
				{this.state.companyTeamArborescence && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Nom du niveau</th>
								<th>Hiérarchie du niveau</th>
								<th>Suppression</th>
							</tr>
						</thead>
						<tbody>
							{this.state.companyTeamArborescence.map((teamArborescence: TeamArborescenceDto, index) => {
								return (
									<tr
										key={index}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl + teamArborescence.id,
											})
										}
									>
										{teamArborescence && (
											<>
												<td>
													<p> {teamArborescence.name} </p>
												</td>
												<td>
													<p> Niveau {teamArborescence.level} </p>
												</td>
												<td>
													<FontAwesomeIcon
														icon={['fas', 'trash']}
														onClick={(e) =>
															this.removeTeamArborescence(e, teamArborescence)
														}
													/>
												</td>
											</>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}

	render() {
		return (
			<div>
				<button
					className={'btn btn-success btn-new'}
					onClick={() =>
						this.props.history.push({
							pathname:
								createCompanyTeamArborescenceAdminPath + `/${this.props.companyId}/team-arborescence/`,
						})
					}
				>
					Nouveau niveau
				</button>
				{this.renderTeamArborescence()}
			</div>
		);
	}
}
export default withRouter(AdminCompanyTeamArborescenceList);

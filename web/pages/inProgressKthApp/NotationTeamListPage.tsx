import * as React from 'react';
import {Component} from 'react';
import {TeamDto} from '../../../server/src/team/dto/team.dto';
import {notationDeliveryOfTeamPath} from '../../routes/inProgressInclukathonAppRoutes';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';

export default class NotationTeamListPage extends Component<InProgressKthWrapperProps, any> {
	teamsToManage = window.connectedUser.teamsToManage;

	displaySingleTeam(team: TeamDto) {
		return (
			<div
				onClick={() => this.props.history.push(`${notationDeliveryOfTeamPath}/${team.id}`)}
				className={`single-team common-kth-square pointer`}
				key={team.id}
			>
				<div className={'empty-div-for-1-1-ratio'} />
				<div className={'sub-div-for-1-1-ratio-content'}>
					<p className={`team-title m-0`}>{team.name}</p>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className={'notation-team-list-page common-list-page-style'}>
				{this.teamsToManage.map((team) => this.displaySingleTeam(team))}
			</div>
		);
	}
}

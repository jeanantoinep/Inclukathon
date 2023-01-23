import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import {DeliverablesListComponent} from '../../components/deliveryComponents/DeliverablesListComponent';

export default class NotationDeliveryOfTeamPage extends Component<InProgressKthWrapperProps, any> {
	teamsToManage = window.connectedUser.teamsToManage;
	currentTeam = this.teamsToManage.find((t) => t.id === this.props.match.params.idTeam);

	render() {
		const currentTeam = this.currentTeam;
		if (!currentTeam) {
			return null;
		}
		return (
			<div>
				<h2>{currentTeam.name}</h2>
				<div className={'notation-single-team-delivery-list-page common-list-page-style'}>
					<DeliverablesListComponent {...this.props} idTeam={currentTeam.id} />
				</div>
			</div>
		);
	}
}

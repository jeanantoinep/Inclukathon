import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import * as React from 'react';
import {UserDto} from '../../../server/src/user/dto/user.dto';
import {UserPresentationModal} from '../../components/trombiComponents/UserPresentationModal';
import {TrombiHelper} from '../../components/trombiComponents/TrombiHelper';
import './TrombinoscopeKthPage.scss';

export default class TrombinoscopeKthPage extends Component<
	InProgressKthWrapperProps,
	{currentUserModal: UserDto | null}
> {
	constructor(props) {
		super(props);
		this.state = {
			currentUserModal: null,
		};
	}

	setUserModalAndOpen = (u: UserDto) => {
		this.setState({
			currentUserModal: u,
		});
		UserPresentationModal.openModal();
	};

	render() {
		const {company} = this.props;
		return (
			<div id="trombinoscope-page">
				<h2 className={'title'}>Les participants</h2>
				<div className={'common-list-page-style'}>
					{TrombiHelper.showUsersListAsTrombi(company.users, this.setUserModalAndOpen)}
					<UserPresentationModal user={this.state.currentUserModal} />
				</div>
			</div>
		);
	}
}

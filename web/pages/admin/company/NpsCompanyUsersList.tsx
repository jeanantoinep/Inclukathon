/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {UserDto} from '../../../../server/src/user/dto/user.dto';
import {TeamDto} from '../../../../server/src/team/dto/team.dto';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {UsersToXlsx} from '../../../jsonToXlsx/UsersToXlsx';

const xlsx = require('json-as-xlsx');

interface IAdminCompanyUsersProps extends IRouterProps {
	companyId: string;
	companyTeams: TeamDto[];
	companyUsers: UserDto[];
}

interface AdminCompanyUsersState {
	companyUsers: UserDto[];
	usersFragmented: UserDto[];
}

class NpsCompanyUsersList extends Component<IAdminCompanyUsersProps, AdminCompanyUsersState> {
	constructor(props) {
		super(props);
		this.state = {
			companyUsers: this.sortUsers(this.props.companyUsers.filter((u) => u.npsNotation >= 0)),
			usersFragmented: [],
		};
	}

	renderSingleUser(user: UserDto) {
		if (!user) {
			return null;
		}
		const hasFirstName = user.firstName && user.firstName.trim() !== '';
		const hasLastName = user.lastName && user.lastName.trim() !== '';
		return (
			<>
				<td className="text-center">
					<p className={'m-0'}> {user.npsNotation} </p>
				</td>
				<td>
					{(hasFirstName || hasLastName) && (
						<p className={'m-0'}>
							{user.firstName} {user.lastName}
						</p>
					)}
					<p className={'m-0'}> {user.email} </p>
				</td>
				<td className="text-center">
					<p className={'m-0'}> {user.npsComment} </p>
				</td>
			</>
		);
	}

	sortUsers = (users: UserDto[]) => {
		return users?.sort((userA, userB) => {
			return userA.npsNotation > userB.npsNotation ? -1 : 1;
		});
	};

	render() {
		return (
			<div className={'manage-company-users-page'}>
				<div className={'d-flex justify-content-end align-items-center mb-3'}>
					<div className={'mr-3'}>
						<button
							className={'btn btn-primary btn-all-colors'}
							onClick={() =>
								xlsx(UsersToXlsx.npsStats(this.state.companyUsers), {
									fileName: 'nps_' + this.props.companyId,
									extraLength: 3,
									writeOptions: {},
								})
							}
						>
							Exporter vers excel
						</button>
					</div>
				</div>
				{this.state.companyUsers.length && (
					<div>
						<p>
							Note moyenne:{' '}
							{this.state.companyUsers.map((u) => u.npsNotation).reduce((a, b) => a + b) /
								this.state.companyUsers.length}
						</p>
						<p>
							NPS (score entre -100 et 100):{' '}
							{(this.state.companyUsers.filter((u) => u.npsNotation > 8).length /
								this.state.companyUsers.length) *
								100 -
								(this.state.companyUsers.filter((u) => u.npsNotation < 7).length /
									this.state.companyUsers.length) *
									100}
						</p>
					</div>
				)}
				{this.state.usersFragmented && (
					<div>
						<div id="nps-pagination-container" />
						<table className={'admin-table mb-4'}>
							<thead>
								<tr>
									<th>Note</th>
									<th>Utilisateur</th>
									<th>Commentaire</th>
								</tr>
							</thead>
							<tbody>
								{this.state.usersFragmented.map((user: UserDto, index) => {
									return <tr key={index}>{this.renderSingleUser(user)}</tr>;
								})}
							</tbody>
						</table>
						<div id="nps-pagination-container-end" />
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
		this.initSinglePagination('#nps-pagination-container');
		this.initSinglePagination('#nps-pagination-container-end');
	}

	componentDidMount() {
		this.initPagination();
	}
}

export default withRouter(NpsCompanyUsersList);

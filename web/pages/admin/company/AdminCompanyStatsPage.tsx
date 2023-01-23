import * as React from 'react';
import {Component} from 'react';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {StatsMainObject} from '../../../../server/src/incluscore/progression/launch.incluscore.stats.service';
import {AdminSingleCompanyStatsPage} from './AdminSingleCompanyStatsPage';

interface IProps extends IRouterProps {
	launchesScr: LaunchIncluscoreDto[];
	stats: StatsMainObject[];
	companyUsersCount: number;
}

export class AdminCompanyStatsPage extends Component<IProps, any> {
	render() {
		return (
			<div className={'all-launches-stats'}>
				{this.props.launchesScr.map((launch) => (
					<AdminSingleCompanyStatsPage
						key={launch.id}
						launchScr={launch}
						companyUsersCount={this.props.companyUsersCount}
						stat={this.props.stats.find((stat) => stat.idLaunch === launch.id)}
					/>
				))}
			</div>
		);
	}
}

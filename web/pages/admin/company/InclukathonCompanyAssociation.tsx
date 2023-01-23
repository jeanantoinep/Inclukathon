import {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from 'react';
import {LaunchInclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/launch.inclukathon.dto';
import {InclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/inclukathon.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {LAUNCH_KTH_CTRL} from '../../../../server/src/provider/routes.helper';
import {SaveLaunchInclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.launch.inclukathon.dto';
import {ToastHelper} from '../../../basics/ToastHelper';

interface IProps {
	companyId: string;
	companyName: string;
	inclukathons: InclukathonDto[];
	companyLaunches: LaunchInclukathonDto[];
}

interface IState {
	companyLaunches: LaunchInclukathonDto[];
	idInclukathonSelected: string;
}

export class InclukathonCompanyAssociation extends Component<IProps, IState> {
	constructor(props) {
		super(props);
		const inclukathonsAvailableToLaunch = this.inclukathonsAvailableToLaunch(this.props.companyLaunches);
		const idInclukathonSelected = inclukathonsAvailableToLaunch
			? inclukathonsAvailableToLaunch[0]?.id || null
			: null;
		this.state = {
			companyLaunches: this.props.companyLaunches,
			idInclukathonSelected: idInclukathonSelected,
		};
	}

	removeLaunchKth = async (e, launch) => {
		e.stopPropagation();
		if (!window.confirm('Supprimer définitivement le lancement ?')) {
			return;
		}
		const companyLaunches: LaunchInclukathonDto[] = await HttpRequester.deleteHttp(LAUNCH_KTH_CTRL, {
			id: launch.id,
			idCompany: this.props.companyId,
		});
		const availableInclukathonsToAdd = this.inclukathonsAvailableToLaunch(companyLaunches);
		this.setState({
			companyLaunches,
			idInclukathonSelected: availableInclukathonsToAdd?.length > 0 ? availableInclukathonsToAdd[0]?.id : '',
		});
		ToastHelper.showSuccessMessage();
	};

	inclukathonsAvailableToLaunch = (companyLaunches = this.state.companyLaunches) => {
		return this.props.inclukathons?.filter((i) => !companyLaunches?.find((t) => t.idInclukathon?.id === i.id));
	};

	selectInclukathonToAdd = (index: number) => {
		if (index) {
			this.setState({
				idInclukathonSelected: this.inclukathonsAvailableToLaunch()[index].id,
			});
		}
	};

	sendTeamInclukathonAssociation = async () => {
		if (!this.state.idInclukathonSelected) {
			return null;
		}
		const companyLaunches: LaunchInclukathonDto[] = await HttpRequester.postHttp(LAUNCH_KTH_CTRL, {
			idCompany: this.props.companyId,
			idInclukathon: this.state.idInclukathonSelected,
		} as SaveLaunchInclukathonDto);
		const availableInclukathonsToAdd = this.inclukathonsAvailableToLaunch(companyLaunches);
		this.setState({
			companyLaunches,
			idInclukathonSelected: availableInclukathonsToAdd?.length > 0 ? availableInclukathonsToAdd[0]?.id : '',
		});
		ToastHelper.showSuccessMessage();
	};

	render() {
		const inclukathonsAvailableToLaunch = this.inclukathonsAvailableToLaunch();
		return (
			<>
				{inclukathonsAvailableToLaunch && inclukathonsAvailableToLaunch.length > 0 && (
					<div className={'team-inclukathon-association d-flex'}>
						<select
							className={'custom-select mr-2'}
							onChange={(e) => this.selectInclukathonToAdd(e.target.selectedIndex)}
							value={this.state.idInclukathonSelected}
						>
							{inclukathonsAvailableToLaunch.map((kth, index) => {
								return (
									<option key={index} value={kth.id}>
										{kth?.name}
									</option>
								);
							})}
						</select>
						<button
							className={'btn btn-default btn-new ml-3'}
							onClick={() => this.sendTeamInclukathonAssociation()}
						>
							Ajouter l'inclukathon a cette équipe
						</button>
					</div>
				)}
				{this.state.companyLaunches.find((cl) =>
					this.props.inclukathons.find((i) => i.id === cl.idInclukathon.id),
				) && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Inclukathons de l'entreprise {this.props.companyName}</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.companyLaunches.map((association, i) => {
								return (
									<tr key={i}>
										<td>{association?.idInclukathon?.name}</td>
										<td>
											<FontAwesomeIcon
												icon={['fas', 'trash']}
												onClick={(e) => this.removeLaunchKth(e, association)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</>
		);
	}
}

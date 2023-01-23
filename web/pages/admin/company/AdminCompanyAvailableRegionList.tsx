import {Component} from 'react';
import * as React from 'react';
import {AvailableRegionDto} from '../../../../server/src/company/dto/availableRegion.dto';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HttpRequester} from '../../../utils/HttpRequester';
import {COMPANY_CTRL} from '../../../../server/src/provider/routes.helper';
import {ToastHelper} from '../../../basics/ToastHelper';
import {withRouter} from 'react-router-dom';
import {createCompanyAvailableRegionAdminPath} from '../../../routes/adminRoutes';

interface IProps extends IRouterProps {
	companyId: string;
	companyAvailableRegion: AvailableRegionDto[];
}

interface IState {
	companyAvailableRegion: AvailableRegionDto[];
}

class AdminCompanyAvailableRegionList extends Component<IProps, IState> {
	removeAvailableRegionLabel = 'Supprimer définitivement la région ?';
	constructor(props) {
		super(props);
		this.state = {
			companyAvailableRegion: this.props.companyAvailableRegion,
		};
	}

	removeAvailableRegion = async (e, availableRegion: AvailableRegionDto) => {
		e.stopPropagation();
		if (!window.confirm(this.removeAvailableRegionLabel)) {
			return;
		}
		const companyAvailableRegion = await HttpRequester.deleteHttp(COMPANY_CTRL + '/available-region', {
			idAvailableRegion: availableRegion.id,
			idCompany: this.props.companyId,
		});
		this.setState({companyAvailableRegion});
		ToastHelper.showSuccessMessage();
	};

	renderAvailableRegion() {
		const editUrl = createCompanyAvailableRegionAdminPath + `/${this.props.companyId}/available-region/`;
		return (
			<div className={'manage-company-regions-page'}>
				{this.state.companyAvailableRegion && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Nom</th>
								<th>Suppression</th>
							</tr>
						</thead>
						<tbody>
							{this.state.companyAvailableRegion.map((availableRegion: AvailableRegionDto, index) => {
								return (
									<tr
										key={index}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl + availableRegion.id,
											})
										}
									>
										{availableRegion && (
											<>
												<td>
													<p> {availableRegion.name} </p>
												</td>
												<td>
													<FontAwesomeIcon
														icon={['fas', 'trash']}
														onClick={(e) => this.removeAvailableRegion(e, availableRegion)}
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
								createCompanyAvailableRegionAdminPath + `/${this.props.companyId}/available-region/`,
						})
					}
				>
					Nouvelle région
				</button>
				{this.renderAvailableRegion()}
			</div>
		);
	}
}
export default withRouter(AdminCompanyAvailableRegionList);

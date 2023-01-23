import * as React from 'react';
import {Component} from 'react';
import {hideLoader, showLoader} from '../../../index';
import {withRouter} from 'react-router-dom';
import {HttpRequester} from '../../../utils/HttpRequester';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';
import {createCompanyAdminPath} from '../../../routes/adminRoutes';
import {COMPANY_CTRL} from '../../../../server/src/provider/routes.helper';

type IProps = IRouterProps;

class AdminCompanies extends Component<IProps, {companies: CompanyDto[]}> {
	constructor(props) {
		super(props);
		this.state = {
			companies: [],
		};
	}

	renderSingleCompany(company: CompanyDto) {
		return (
			<>
				<td>
					{company.imgPath && (
						<img
							className={'d-block m-auto'}
							width={'25%'}
							src={'/company-logo/' + company.imgPath}
							alt={'logo'}
						/>
					)}
				</td>
				<td>
					<p> {company.name} </p>
				</td>
				<td>
					{company.teams &&
						company.teams.map((t, i) => {
							const classEnabled = t.enabled ? 'm-1' : 'm-1 not-enabled';
							return (
								<p className={classEnabled} key={i}>
									{' '}
									{t.name}{' '}
								</p>
							);
						})}
				</td>
				{company.users ? (
					<td>{company?.users?.length > 0 && company.users.length + ' utilisateurs'}</td>
				) : (
					<td />
				)}
			</>
		);
	}

	render() {
		const companies = this.state.companies;
		const history = this.props.history;
		const editUrl = createCompanyAdminPath;
		return (
			<div className={'manage-company-page'}>
				<div>
					<button
						className={'d-block btn btn-success btn-new ml-auto mr-0'}
						onClick={() => history.push({pathname: editUrl})}
					>
						Nouvelle entreprise
					</button>
				</div>
				<table className={'admin-table'}>
					<thead>
						<tr>
							<th>Logo</th>
							<th>Name</th>
							<th>Teams</th>
							<th>Users</th>
						</tr>
					</thead>
					<tbody>
						{companies.map((company, index) => {
							return (
								<tr
									key={index}
									onClick={() =>
										history.push({
											pathname: editUrl + `/${company.id}`,
										})
									}
								>
									{this.renderSingleCompany(company)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	async componentDidMount() {
		showLoader(this.constructor.name);
		const companies: CompanyDto[] = await HttpRequester.getHttp(COMPANY_CTRL);
		hideLoader(this.constructor.name);
		this.setState({companies});
	}
}

export default withRouter(AdminCompanies);

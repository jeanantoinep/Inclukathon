import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import AdminCompanyUsers from './AdminCompanyUsers';
import {CompanyDto} from '../../../../server/src/company/dto/company.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveCompanyDto} from '../../../../server/src/company/dto/save.company.dto';
import AdminCompanyTeams from './AdminCompanyTeamsList';
import {LaunchIncluscoreDto} from '../../../../server/src/incluscore/dto/launch.incluscore.dto';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import {COMPANY_PAGE_LOGO_UPLOAD} from '../../../utils/FileUploaderHelper';
import {LaunchInclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/launch.inclukathon.dto';
import {
	COMPANY_CTRL,
	INCLUKATHON_CTRL,
	INCLUSCORE_CTRL,
	LAUNCH_KTH_CTRL,
	LAUNCH_SCR_CTRL,
} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {ToastHelper} from '../../../basics/ToastHelper';
import {
	adminSingleCompanyStatsByTeamPath,
	adminSingleCompanyStatsPath,
	createCompanyAdminPath,
} from '../../../routes/adminRoutes';
import {hideLoader, showLoader} from '../../../index';
import {AdminCollapseBloc} from '../AdminCollapseBloc';
import {IncluscoreDto} from '../../../../server/src/incluscore/dto/incluscore.dto';
import {InclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/inclukathon.dto';
import {InclukathonCompanyAssociation} from './InclukathonCompanyAssociation';
import {IncluscoreCompanyAssociation} from './IncluscoreCompanyAssociation';
import AdminCompanyTeamArborescenceList from './AdminCompanyTeamArborescenceList';
import NpsCompanyUsersList from './NpsCompanyUsersList';
import AdminCompanyAvailableRegionList from './AdminCompanyAvailableRegionList';

export const INCLUKATHON_COMPANY_LOGO_WIDTH = 200;

interface IState extends CompanyDto {
	launchesScr: LaunchIncluscoreDto[];
	launchesKth: LaunchInclukathonDto[];
	idIncluscoreSelected: string;
	idInclukathonSelected: string;
	incluscoresAvailable: IncluscoreDto[];
	inclukathonsAvailable: InclukathonDto[];
}

class AdminCompaniesForm extends Component<IRouterProps, IState> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			imgPath: '',
			teamArborescence: [],
			teams: [],
			users: [],
			launchesScr: [],
			launchesKth: [],
			idIncluscoreSelected: '',
			idInclukathonSelected: '',
			incluscoresAvailable: [],
			inclukathonsAvailable: [],
			availableRegions: [],
			displayRegions: false,
		};
	}

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleSubmit = async () => {
		const updatedCompany = await HttpRequester.postHttp(COMPANY_CTRL, this.state as SaveCompanyDto);
		const oldId = this.state.id;
		this.setState({
			...updatedCompany,
		});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createCompanyAdminPath}/${updatedCompany.id}`);
		}
	};

	companyStatsLinks() {
		return (
			<div className={'stats-links'}>
				{this.state.launchesScr.map((launch) => (
					<div className={'mt-3'} key={'stat-' + launch.id}>
						<h3>
							Résultats <span className={'c-sweet-purple'}>{launch.idIncluscore?.name}</span> Au global
						</h3>
						<button
							className={'btn btn-primary btn-all-colors mt-3 mb-3 ml-auto mr-auto'}
							onClick={() =>
								this.props.history.push(
									adminSingleCompanyStatsPath + '/' + this.state.id + '/launch/' + launch.id,
								)
							}
						>
							Statistiques pour {launch.idIncluscore?.name}
						</button>
						<h3>
							Résultats <span className={'c-sweet-purple'}>{launch.idIncluscore?.name}</span> Par équipes
						</h3>
						{this.state.teams.map((team) => (
							<button
								key={'stat-' + team.id}
								className={'btn btn-primary btn-all-colors mt-3 mb-3 ml-auto mr-auto'}
								onClick={() =>
									this.props.history.push(
										adminSingleCompanyStatsByTeamPath +
											'/' +
											this.state.id +
											'/launch/' +
											launch.id +
											'/team/' +
											team.id,
									)
								}
							>
								Statistiques pour {team?.arborescence}
							</button>
						))}
						<hr />
					</div>
				))}
			</div>
		);
	}

	render() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()}>
					<div className={'d-flex justify-content-between align-items-center mt-5 mb-3'}>
						<div className={'w-100 mr-2'}>
							<h1> Gestion d'une entreprise </h1>
							<BasicInput
								inputName={'name'}
								value={this.state.name}
								type="text"
								change={this.handleValue}
							/>
						</div>
						{this.state.id && (
							<div className={'d-flex'}>
								<FilePondInput
									id={'company-logo'}
									loadImage={false}
									filesPath={this.state.imgPath ? [this.state.imgPath] : []}
									squareSideLength={INCLUKATHON_COMPANY_LOGO_WIDTH}
									idToAssignToFilename={this.state.id}
									apiUrl={COMPANY_PAGE_LOGO_UPLOAD}
									filenameSuffix={'company-picture'}
									imageCropAspectRatio={'1:1'}
									keepOriginalFileName={true}
									typeOfFileExpected={'image/*'}
									extraBodyParams={[
										{
											key: 'idCompany',
											value: this.state.id,
										},
									]}
								/>
							</div>
						)}
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
				</form>

				{this.state.id && (
					<>
						<BasicInput
							inputName={'displayRegions'}
							label={`Afficher le champ Régions a l'inscription`}
							value={this.state.displayRegions}
							type="checkbox"
							change={this.handleValue}
						/>
						{this.state.displayRegions && (
							<AdminCollapseBloc id={'available-regions-collapse-bloc'} title={`Régions disponibles`}>
								<AdminCompanyAvailableRegionList
									companyId={this.state.id}
									companyAvailableRegion={this.state.availableRegions}
								/>
							</AdminCollapseBloc>
						)}
						<AdminCollapseBloc
							id={'arborescence-collapse-bloc'}
							title={`Niveaux d'équipes de l'entreprise`}
						>
							<AdminCompanyTeamArborescenceList
								companyId={this.state.id}
								companyTeamArborescence={this.state.teamArborescence}
							/>
						</AdminCollapseBloc>
						<AdminCollapseBloc title={`Équipes de l'entreprise`} id={'team-collapse-bloc'}>
							<AdminCompanyTeams
								companyId={this.state.id}
								companyTeams={this.state.teams}
								companyUsers={this.state.users}
							/>
						</AdminCollapseBloc>
						<AdminCollapseBloc id={'launches-scr-collapse-bloc'} title={`Incluscores de l'entreprise`}>
							<IncluscoreCompanyAssociation
								companyId={this.state.id}
								companyName={this.state.name}
								companyLaunches={this.state.launchesScr}
								incluscores={this.state.incluscoresAvailable}
								companyTeams={this.state.teams} // for stats
							/>
						</AdminCollapseBloc>
						<AdminCollapseBloc id={'launches-kth-collapse-bloc'} title={`Inclukathon de l'entreprise`}>
							<InclukathonCompanyAssociation
								companyId={this.state.id}
								companyName={this.state.name}
								companyLaunches={this.state.launchesKth}
								inclukathons={this.state.inclukathonsAvailable}
							/>
						</AdminCollapseBloc>
						<AdminCollapseBloc id={`users-list-collapse-bloc`} title={`Utilisateurs de l'entreprise`}>
							<AdminCompanyUsers
								key={this.state.id}
								companyId={this.state.id}
								companyTeams={this.state.teams}
								companyUsers={this.state.users}
								launchesScr={this.state.launchesScr}
							/>
						</AdminCollapseBloc>
						<AdminCollapseBloc id={`nps-list`} title={`NPS`}>
							<NpsCompanyUsersList
								key={this.state.id}
								companyId={this.state.id}
								companyTeams={this.state.teams}
								companyUsers={this.state.users}
							/>
						</AdminCollapseBloc>
					</>
				)}
			</>
		);
	}

	async componentDidMount() {
		const {idCompany} = this.props.match.params;
		if (idCompany) {
			showLoader(this.constructor.name);
			const company: CompanyDto = await HttpRequester.getHttp(`${COMPANY_CTRL}/${idCompany}`);
			const incluscoresAvailable: IncluscoreDto[] = await HttpRequester.getHttp(
				INCLUSCORE_CTRL + '/for-company-association',
			);
			const inclukathonsAvailable: InclukathonDto[] = await HttpRequester.getHttp(
				INCLUKATHON_CTRL + '/for-company-association',
			);
			const launchesScr: LaunchIncluscoreDto[] = await HttpRequester.getHttp(
				LAUNCH_SCR_CTRL + '/company/' + idCompany,
			);
			const launchesKth: LaunchInclukathonDto[] = await HttpRequester.getHttp(
				LAUNCH_KTH_CTRL + '/company/' + idCompany,
			);
			this.setState({
				...company,
				launchesScr,
				launchesKth,
				incluscoresAvailable,
				inclukathonsAvailable,
			});
			hideLoader(this.constructor.name);
		}
	}
}

export default withRouter(AdminCompaniesForm);

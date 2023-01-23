import * as React from 'react';
import {lazy} from 'react';
import AdminCommon from '../pages/admin/AdminCommon';
import AdminCompaniesPage from '../pages/admin/company/AdminCompanies';
import AdminCompaniesForm from '../pages/admin/company/AdminCompaniesForm';
import AdminCompanyUsersForm from '../pages/admin/company/AdminCompanyUsersForm';
import AdminCompanyTeamForm from '../pages/admin/company/AdminCompanyTeamForm';
import AdminIncluscoresPage from '../pages/admin/incluscore/AdminIncluscoresList';
import AdminIncluscoresForm from '../pages/admin/incluscore/AdminIncluscoresForm';
import AdminIncluscoreThemesForm from '../pages/admin/incluscore/AdminIncluscoreThemesForm';
import AdminIncluscoreQuestionsForm from '../pages/admin/incluscore/AdminIncluscoreQuestionsForm';
import AdminIncluscorePropositionsForm from '../pages/admin/incluscore/AdminIncluscorePropositionsForm';
import AdminInclukathonsListPage from '../pages/admin/inclukathon/AdminInclukathonsListPage';
import AdminInclukathonsForm from '../pages/admin/inclukathon/AdminInclukathonsForm';
import AdminBaiKthForm from '../pages/admin/inclukathon/AdminBaiKthForm';
import AdminKthScrAssociationForm from '../pages/admin/inclukathon/AdminKthScrAssociationForm';
import AdminDeliveryTypeForm from '../pages/admin/inclukathon/AdminDeliverableTypeForm';
import {Route} from 'react-router-dom';
import AdminNotationDeliveryForm from '../pages/admin/inclukathon/AdminNotationDeliveryForm';
import {accountPath} from './inProgressInclukathonAppRoutes';
import AdminSingleCompanyStatsPage from '../pages/admin/company/AdminSingleCompanyStatsPage';
import AdminCompanyTeamArborescenceForm from '../pages/admin/company/AdminCompanyTeamArborescenceForm';
import AdminCompanyAvailableRegionForm from '../pages/admin/company/AdminCompanyAvailableRegionForm';

const AdminWebinarListPage = lazy(() => import('../pages/admin/company/WebinarListPage'));
const AdminWebinarForm = lazy(() => import('../pages/admin/company/WebinarForm'));

export const adminPath = '/admin';
// admin company
export const companyAdminPath = adminPath + '/manage-companies';
export const createCompanyAdminPath = adminPath + '/create-companies';
export const createCompanyUsersAdminPath = adminPath + '/create-company-users';
export const createCompanyTeamsAdminPath = adminPath + '/create-company-team';
export const createCompanyTeamArborescenceAdminPath = adminPath + '/create-company-team-arborescence';
export const createCompanyAvailableRegionAdminPath = adminPath + '/create-company-available-region';
// admin incluscore
export const incluscoreAdminPath = adminPath + '/manage-incluscores';
export const createIncluscoreAdminPath = adminPath + '/create-incluscore';
export const createIncluscoreThemeAdminPath = adminPath + '/create-incluscore-themes';
export const createIncluscoreQuestionAdminPath = adminPath + '/create-incluscore-questions';
export const createIncluscorePropositionAdminPath = adminPath + '/create-incluscore-propositions';
// admin inclukathon
export const inclukathonAdminPath = adminPath + '/manage-inclukathons';
export const createInclukathonsAdminPath = adminPath + '/create-inclukathon';
export const createInclukathonsBaiAdminPath = adminPath + '/create-inclukathon-bai';
export const createInclukathonsScrAdminPath = adminPath + '/create-inclukathon-scr';
export const createInclukathonsDeliverableTypeAdminPath = adminPath + '/create-inclukathon-deliverable-type';
export const createNotationDeliveryAdminPath = adminPath + '/create-notation-delivery';
// stats
export const adminSingleCompanyStatsPath = adminPath + '/launch-scr-stat';
export const adminSingleCompanyStatsByTeamPath = adminPath + '/team-scr-stat';
// webinar
export const webinarAdminPath = adminPath + '/webinar';
export const createWebinarAdminPath = adminPath + '/create-webinar';

export const getAdminRoutes = () => {
	return [
		<Route exact path={webinarAdminPath} key={webinarAdminPath}>
			<AdminCommon backUrl={accountPath}>
				<AdminWebinarListPage />
			</AdminCommon>
		</Route>,
		<Route exact path={companyAdminPath} key={companyAdminPath}>
			<AdminCommon backUrl={accountPath}>
				<AdminCompaniesPage />
			</AdminCommon>
		</Route>,
		<Route exact path={createCompanyAdminPath + '/:idCompany?'} key={createCompanyAdminPath}>
			<AdminCommon backUrl={companyAdminPath}>
				<AdminCompaniesForm />
			</AdminCommon>
		</Route>,
		<Route
			exact
			path={createCompanyUsersAdminPath + '/:idCompany/user/:idUser?'}
			key={createCompanyUsersAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminCompanyUsersForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createCompanyTeamArborescenceAdminPath + '/:idCompany/team-arborescence/:idTeamArborescence?'}
			key={createCompanyTeamArborescenceAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminCompanyTeamArborescenceForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createCompanyAvailableRegionAdminPath + '/:idCompany/available-region/:idAvailableRegion?'}
			key={createCompanyAvailableRegionAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminCompanyAvailableRegionForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createCompanyTeamsAdminPath + '/:idCompany/team/:idTeam?'}
			key={createCompanyTeamsAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminCompanyTeamForm />
				</AdminCommon>
			)}
		/>,
		<Route exact path={incluscoreAdminPath} key={incluscoreAdminPath}>
			<AdminCommon backUrl={accountPath}>
				<AdminIncluscoresPage />
			</AdminCommon>
		</Route>,
		<Route path={createIncluscoreAdminPath + '/:id?'} key={createIncluscoreAdminPath}>
			<AdminCommon backUrl={incluscoreAdminPath}>
				<AdminIncluscoresForm />
			</AdminCommon>
		</Route>,
		<Route
			exact
			path={createIncluscoreThemeAdminPath + '/:idIncluscore/theme/:idTheme?'}
			key={createIncluscoreThemeAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createIncluscoreAdminPath + '/' + match.params.idIncluscore}>
					<AdminIncluscoreThemesForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createIncluscoreQuestionAdminPath + '/:idIncluscore/theme/:idTheme/question/:idQuestion?'}
			key={createIncluscoreQuestionAdminPath}
			children={({match}) => (
				<AdminCommon
					backUrl={
						createIncluscoreThemeAdminPath +
						'/' +
						match.params.idIncluscore +
						'/theme/' +
						match.params.idTheme
					}
				>
					<AdminIncluscoreQuestionsForm />
				</AdminCommon>
			)}
		/>,

		<Route
			exact
			path={
				createIncluscorePropositionAdminPath +
				'/:idIncluscore?/theme/:idTheme?/question/:idQuestion?/proposition/:idProposition?'
			}
			key={createIncluscorePropositionAdminPath}
			children={({match}) => (
				<AdminCommon
					backUrl={
						createIncluscoreQuestionAdminPath +
						'/' +
						match.params.idIncluscore +
						'/theme/' +
						match.params.idTheme +
						'/question/' +
						match.params.idQuestion
					}
				>
					<AdminIncluscorePropositionsForm />
				</AdminCommon>
			)}
		/>,
		<Route exact path={inclukathonAdminPath} key={inclukathonAdminPath}>
			<AdminCommon backUrl={accountPath}>
				<AdminInclukathonsListPage />
			</AdminCommon>
		</Route>,
		<Route path={createInclukathonsAdminPath + '/:id?'} key={createInclukathonsAdminPath}>
			<AdminCommon backUrl={inclukathonAdminPath}>
				<AdminInclukathonsForm />
			</AdminCommon>
		</Route>,
		<Route
			exact
			path={createInclukathonsBaiAdminPath + '/:idInclukathon/bai/:idBai?'}
			key={createInclukathonsBaiAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createInclukathonsAdminPath + '/' + match.params.idInclukathon}>
					<AdminBaiKthForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createInclukathonsScrAdminPath + '/:idInclukathon/scr/:idKthScrAssociation?'}
			key={createInclukathonsScrAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createInclukathonsAdminPath + '/' + match.params.idInclukathon}>
					<AdminKthScrAssociationForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createInclukathonsDeliverableTypeAdminPath + '/:idInclukathon/deliverable/:idDeliverable?'}
			key={createInclukathonsDeliverableTypeAdminPath}
			children={({match}) => (
				<AdminCommon backUrl={createInclukathonsAdminPath + '/' + match.params.idInclukathon}>
					<AdminDeliveryTypeForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={createNotationDeliveryAdminPath + '/:idInclukathon/deliverable/:idDeliverable?/notation/:idNotation?'}
			key={createNotationDeliveryAdminPath}
			children={({match}) => (
				<AdminCommon
					backUrl={
						createInclukathonsDeliverableTypeAdminPath +
						'/' +
						match.params.idInclukathon +
						'/deliverable/' +
						match.params.idDeliverable
					}
				>
					<AdminNotationDeliveryForm />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={adminSingleCompanyStatsPath + '/:idCompany/launch/:idLaunch'}
			key={adminSingleCompanyStatsPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminSingleCompanyStatsPage />
				</AdminCommon>
			)}
		/>,
		<Route
			exact
			path={adminSingleCompanyStatsByTeamPath + '/:idCompany/launch/:idLaunch/team/:idTeam'}
			key={adminSingleCompanyStatsByTeamPath}
			children={({match}) => (
				<AdminCommon backUrl={createCompanyAdminPath + '/' + match.params.idCompany}>
					<AdminSingleCompanyStatsPage />
				</AdminCommon>
			)}
		/>,
		<Route exact path={createWebinarAdminPath + '/:idWebinar?'} key={createWebinarAdminPath}>
			<AdminCommon backUrl={webinarAdminPath}>
				<AdminWebinarForm />
			</AdminCommon>
		</Route>,
	];
};

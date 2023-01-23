import * as React from 'react';
import {Route} from 'react-router-dom';
import {lazy} from 'react';
import InProgressKthPageWrapper from '../pages/inProgressKthApp/InProgressKthPageWrapper';
import {SingleDeliveryComponent} from '../components/deliveryComponents/SingleDeliveryComponent';

const ChallengeExplanationKthPage = lazy(() => import('../pages/inProgressKthApp/ChallengeExplanationKthPage'));
const TrombinoscopeKthPage = lazy(() => import('../pages/inProgressKthApp/TrombinoscopeKthPage'));
const BaiKthPage = lazy(() => import('../pages/inProgressKthApp/BaiKthPage'));
const SingleBaiKthPage = lazy(() => import('../pages/inProgressKthApp/SingleBaiKthPage'));
const IncluscoresOfKthPage = lazy(() => import('../pages/inProgressKthApp/IncluscoresOfKthPage'));
const NotationTeamListPage = lazy(() => import('../pages/inProgressKthApp/NotationTeamListPage'));
const NotationDeliveryOfTeamPage = lazy(() => import('../pages/inProgressKthApp/NotationDeliveryOfTeamPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));

export const inProgressKthCommonPath = '/kth';

export const challengeKthPath = inProgressKthCommonPath + '/challenge';
export const trombinoscopeKthPath = inProgressKthCommonPath + '/participants';
export const baiKthPath = inProgressKthCommonPath + '/idea';
export const singleBaiKthPath = baiKthPath + '/id';
export const incluscoresOfKthPath = inProgressKthCommonPath + '/incluscore';
export const notationTeamListPath = inProgressKthCommonPath + '/notation';
export const notationDeliveryOfTeamPath = notationTeamListPath + '/team';
export const singleDeliveryPath = inProgressKthCommonPath + '/single-delivery';
export const accountPath = inProgressKthCommonPath + '/account';

export const getInProgressInclukathonAppRoutes = () => {
	return [
		<Route exact path={challengeKthPath} key={challengeKthPath}>
			<InProgressKthPageWrapper>
				<ChallengeExplanationKthPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={trombinoscopeKthPath} key={trombinoscopeKthPath}>
			<InProgressKthPageWrapper>
				<TrombinoscopeKthPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={baiKthPath} key={baiKthPath}>
			<InProgressKthPageWrapper>
				<BaiKthPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={singleBaiKthPath + '/:idBai'} key={singleBaiKthPath}>
			<InProgressKthPageWrapper>
				<SingleBaiKthPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={incluscoresOfKthPath} key={incluscoresOfKthPath}>
			<InProgressKthPageWrapper>
				<IncluscoresOfKthPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={notationTeamListPath} key={notationTeamListPath}>
			<InProgressKthPageWrapper>
				<NotationTeamListPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={notationDeliveryOfTeamPath + '/:idTeam'} key={notationDeliveryOfTeamPath}>
			<InProgressKthPageWrapper>
				<NotationDeliveryOfTeamPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route exact path={accountPath} key={accountPath}>
			<InProgressKthPageWrapper accessibleWithoutInProgressKth={true}>
				<AccountPage />
			</InProgressKthPageWrapper>
		</Route>,
		<Route
			exact
			path={singleDeliveryPath + '/team/:idTeam/delivery/:idDelivery/index/:index'}
			key={singleDeliveryPath}
		>
			<InProgressKthPageWrapper refreshUser={true}>
				<SingleDeliveryComponent />
			</InProgressKthPageWrapper>
		</Route>,
	];
};

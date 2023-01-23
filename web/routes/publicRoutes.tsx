import * as React from 'react';
import {lazy} from 'react';
import {Route} from 'react-router-dom';
import CGVPage from '../pages/CGV';

const ContactPage = lazy(() => import('../pages/ContactPage'));
const InclukathonPage = lazy(() => import('../pages/InclukathonPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const PrestationPage = lazy(() => import('../pages/PrestationPage'));
const InclusionConseilPage = lazy(() => import('../pages/InclusionConseilPage'));

export const contactPath = '/contact';
export const inclusionConseilPath = '/inclusion-conseil';
export const servicesPath = '/services-page';
export const appLoggedPath = '/app-logged';
export const loginPath = appLoggedPath + '/login-page';

export const getPublicRoutes = () => {
	return [
		<Route exact path="/" key={'home-inclukathon-public-route'}>
			<InclukathonPage />
		</Route>,
		<Route exact path={contactPath} key={contactPath}>
			<ContactPage />
		</Route>,
		<Route exact path={inclusionConseilPath} key={inclusionConseilPath}>
			<InclusionConseilPage />
		</Route>,
		<Route exact path={servicesPath} key={servicesPath}>
			<PrestationPage />
		</Route>,
		<Route exact path={loginPath} key={loginPath}>
			<LoginPage />
		</Route>,
		<Route exact path="/cgv" key={'/cgv'}>
			<CGVPage />
		</Route>,
	];
};

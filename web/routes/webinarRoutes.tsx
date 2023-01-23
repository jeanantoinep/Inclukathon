import * as React from 'react';
import {lazy} from 'react';
import {Route} from 'react-router-dom';

const WebinarHome = lazy(() => import('../pages/WebinarHome'));
export const webinarHomePath = '/webinar-home';

export const getWebinarRoutes = () => {
	return [
		<Route exact path={webinarHomePath + '/:idWebinar'} key={webinarHomePath}>
			<WebinarHome />
		</Route>,
	];
};

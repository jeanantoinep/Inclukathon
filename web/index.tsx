import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './bootstrap.min.scss';
import './styling/_colors.scss';
import './styling/_gradiant.scss';
import './common.scss';
import {HttpRequester} from './utils/HttpRequester';
import {LoggedUserDto} from '../server/src/user/dto/logged.user.dto';
import {LOGIN_CTRL, USER_CTRL} from '../server/src/provider/routes.helper';
import {App, INCLU_LANG_CHOSEN_KEY} from './App';
import * as Sentry from '@sentry/react';
import {BrowserTracing} from '@sentry/tracing';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import LoginPage from './pages/LoginPage';
import './i18n';
import {ILang} from '../server/src/translations/LangUtils';
import i18n from './i18n';
import {inclucardAppPath, incluscoreAppPath} from './routes/incluscoreAppRoutes';
import {UserDto} from '../server/src/user/dto/user.dto';
import {Log} from 'fuse-box/Log';

export const isProd = process.env.NODE_ENV === 'production';

console.log(`isProd: ${isProd}`);

export const getIsMobile = () => window.innerWidth <= 992;
export const showLoader = (currentComponentName: string) => {
	const loaderActiveClass = getLoaderActiveClass(currentComponentName);
	const hadToAddClassLoader = !document.getElementById('loader').classList.contains(loaderActiveClass);
	if (hadToAddClassLoader) {
		document.getElementById('loader').classList.add(loaderActiveClass);
	}
	const hadToAddClassRoot = !document.getElementById('root').classList.contains(loaderActiveClass);
	if (hadToAddClassRoot) {
		document.getElementById('root').classList.add(loaderActiveClass);
	}
};
export const hideLoader = (currentComponentName: string) => {
	const loaderActiveClass = getLoaderActiveClass(currentComponentName);
	document.getElementById('loader').classList.remove(loaderActiveClass);
	document.getElementById('root').classList.remove(loaderActiveClass);
};

const getLoaderActiveClass = (currentComponentName: string) => 'is-loading-' + currentComponentName;

async function runApp() {
	const isVeryLightUserParam =
		window.location.pathname.includes(incluscoreAppPath) || window.location.pathname.includes(inclucardAppPath);
	const user: LoggedUserDto = await HttpRequester.getHttp(
		LOGIN_CTRL + `${isVeryLightUserParam ? '?very-light-user=true' : ''}`,
	);
	let lang: ILang = ILang.FR;
	const storedLang = window.localStorage.getItem(INCLU_LANG_CHOSEN_KEY) as ILang;
	if (storedLang) {
		lang = storedLang;
	}
	if (user?.id === localStorage.getItem('user-id')) {
		LoginPage.saveUserConnectedInfos(user);
		if (storedLang) {
			HttpRequester.postHttp(USER_CTRL + '/set-lang', {userId: window.connectedUser.id, lang}).then();
			window.localStorage.removeItem(INCLU_LANG_CHOSEN_KEY);
		} else {
			lang = user?.lang;
		}
	} else {
		LoginPage.logout();
	}
	await i18n.changeLanguage(lang);
	if (isProd) {
		initSentry();
		initSegmentAnalyticsUser();
	}
	ReactDOM.render(<App startingLang={lang} />, document.querySelector('div#root'));
}

export function isInclusionConseilUser() {
	return (
		window.connectedUser?.company?.name === 'Inclukathon' ||
		window.connectedUser?.company?.id === '6033f3606d7b7c031653509d' ||
		window.connectedUser?.isSuperAdmin
	);
}

export function transformUserForTierceApi(user: LoggedUserDto) {
	if (user) {
		return {
			...user,
			companyId: user.company?.id,
			companyName: user.company?.name,
			username: user.firstName + ' ' + user.lastName,
			token: undefined,
			manageTeams: undefined,
			team: undefined,
			teamsToManage: undefined,
			company: undefined,
			pwd: undefined,
			password: undefined,
		};
	}
	return user;
}

export function initSegmentAnalyticsUser() {
	// identify also inclusion conseil company users because viewed page is sent anyway
	if (!window.analytics) {
		setTimeout(initSegmentAnalyticsUser, 100);
		return;
	}
	let traits: any = {};
	if (window.connectedUser) {
		traits = {...transformUserForTierceApi(window.connectedUser)};
	}
	traits.inclukathon_url = window.location.href;
	window.analytics.identify(window.connectedUser?.id, traits);
}

function initSentry() {
	Sentry.init({
		release: process.env.npm_package_name + '@' + process.env.npm_package_version,
		dsn: '',
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0,
		beforeSend(event) {
			if (isInclusionConseilUser()) {
				// don't send event !
				return null;
			}
			event.user = transformUserForTierceApi(window.connectedUser || event.user);
			return event;
		},
		initialScope: {
			user: window.connectedUser ? transformUserForTierceApi(window.connectedUser) : null,
		},
	});
}

showLoader('index');
(async () => {
	try {
		await runApp();
	} catch (e) {
		console.error(e);
		hideLoader('index');
	}
})();

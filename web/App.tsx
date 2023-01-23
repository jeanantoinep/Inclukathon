import * as React from 'react';
import {Suspense} from 'react';
import Navbar from './components/menu/NavBar';
import {appLoggedPath, getPublicRoutes, inclusionConseilPath} from './routes/publicRoutes';
import {getIncluscoreAppRoutes, inclucardAppPath, incluscoreAppPath} from './routes/incluscoreAppRoutes';
import {getInProgressInclukathonAppRoutes, inProgressKthCommonPath} from './routes/inProgressInclukathonAppRoutes';
import {adminPath, getAdminRoutes} from './routes/adminRoutes';
import IncluscoreAppWrapper from './pages/IncluscoreApp/IncluscoreAppWrapper';
import IncluscoreApp404 from './pages/IncluscoreApp/IncluscoreApp404';
import Footer from './components/Footer';
import {hideLoader} from './index';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ErrorBoundary} from './catchErrors/ErrorBoundaries';
import {useLocation} from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import {MenuSuperAdminFixed} from './components/admin/MenuSuperAdminFixed';
import * as OverlayScrollbars from 'overlayscrollbars';
import {Animations} from './utils/OnScrollHelper';
import i18n from './i18n';
import {ILang} from '../server/src/translations/LangUtils';
import {HttpRequester} from './utils/HttpRequester';
import {USER_CTRL} from '../server/src/provider/routes.helper';
import {FR} from 'country-flag-icons/react/3x2';
import {GB} from 'country-flag-icons/react/3x2';
import {ES} from 'country-flag-icons/react/3x2';
import {ToastHelper} from './basics/ToastHelper';
import {getWebinarRoutes, webinarHomePath} from './routes/webinarRoutes';

const DisplayNavbar = () => {
	const location = useLocation();
	const {pathname} = location;
	const display =
		!pathname.includes(incluscoreAppPath) &&
		!pathname.includes(inclucardAppPath) &&
		!pathname.includes(webinarHomePath);
	return display ? <Navbar isInclusionConseilWebsite={false} /> : null;
};

export const INCLU_LANG_CHOSEN_KEY = 'USER_HAS_CHANGE_LANG';

const languageSelection = (lang: ILang, setLanguage: (lang: ILang) => any) => {
	window.localStorage.setItem(INCLU_LANG_CHOSEN_KEY, lang);
	i18n.changeLanguage(lang);
	setLanguage(lang);
	if (window.connectedUser?.id) {
		HttpRequester.postHttp(USER_CTRL + '/set-lang', {userId: window.connectedUser.id, lang}).then();
	}
	const languageSuccess = i18n.t('languageSelection', {ns: 'incluscore'});
	ToastHelper.showIncluscoreMsg(languageSuccess);
};

const DisplayLanguageSelection = (props: {setLanguage: (lang: ILang) => any}) => {
	return (
		<div className={'flag-containers'}>
			{i18n.language != ILang.FR && (
				<div
					className={'flag-container c-liquorice-bg p-1 pointer'}
					onClick={() => languageSelection(ILang.FR, props.setLanguage)}
				>
					<FR title="France" className={'w-100'} />
				</div>
			)}
			{i18n.language != ILang.EN && (
				<div
					className={'flag-container c-liquorice-bg p-1 pointer'}
					onClick={() => languageSelection(ILang.EN, props.setLanguage)}
				>
					<GB title={'English'} className={'w-100'} />
				</div>
			)}
			{i18n.language != ILang.ES && (
				<div
					className={'flag-container c-liquorice-bg p-1 pointer'}
					onClick={() => languageSelection(ILang.ES, props.setLanguage)}
				>
					<ES title={'Español'} className={'w-100'} />
				</div>
			)}
		</div>
	);
};

const DisplayFooter = () => {
	const location = useLocation();
	const {pathname} = location;
	const display =
		!pathname.includes(appLoggedPath) &&
		!pathname.includes(adminPath) &&
		!pathname.includes(incluscoreAppPath) &&
		!pathname.includes(inclucardAppPath) &&
		!pathname.includes(inProgressKthCommonPath) &&
		!pathname.includes(webinarHomePath);
	return display ? <Footer isInclusionConseilWebsite={false} /> : null;
};

const PagesSubNavbarWrapper = (props) => {
	const location = useLocation();
	const {pathname} = location;
	const commercialPage =
		!pathname.includes(appLoggedPath) &&
		!pathname.includes(incluscoreAppPath) &&
		!pathname.includes(inclucardAppPath) &&
		!pathname.includes(inProgressKthCommonPath);
	const appLogged = pathname.includes(appLoggedPath);
	return (
		<div
			className={`pages-sub-navbar-container ${commercialPage ? 'commercial-page' : ''} ${
				appLogged ? 'app-logged-page' : ''
			}`}
		>
			{React.cloneElement(props.children, {})}
		</div>
	);
};

export const defaultScrollEventCallback = () => {
	Navbar.updateNavbarShadowClass();
	if (window.location.href.indexOf(inclusionConseilPath) > -1) {
		Animations.flipXOnElementVisible('.values-container');
	}
};

export const overlayScrollBodyInstance = window.location.pathname.includes('admin')
	? {}
	: OverlayScrollbars(document.querySelectorAll('body'), {
			callbacks: {
				onScroll: defaultScrollEventCallback,
			},
			nativeScrollbarsOverlaid: {
				initialize: false,
			},
	  });

interface IProps {
	startingLang: ILang;
}
interface IState {
	lang: ILang;
}
export class App extends React.Component<IProps, IState> {
	constructor(props) {
		super(props);
		this.state = {
			lang: this.props.startingLang,
		};
	}

	routes = [
		...getPublicRoutes(),
		...getIncluscoreAppRoutes(),
		...getInProgressInclukathonAppRoutes(),
		...getAdminRoutes(),
		...getWebinarRoutes(),
		<Route key={'incluscore-404'} path={incluscoreAppPath + '*'}>
			<IncluscoreAppWrapper isErrorPage={true}>
				<IncluscoreApp404 />
			</IncluscoreAppWrapper>
		</Route>,
		<Route key={'page-not-found'} path="*">
			<PageNotFound />
		</Route>,
	];

	render() {
		const hideAdminButtons =
			window.location.pathname.includes(incluscoreAppPath) ||
			window.location.pathname.includes(inclucardAppPath) ||
			window.location.pathname.includes(webinarHomePath);
		return (
			<ErrorBoundary>
				<Router>
					<Suspense fallback={<div id={'react-suspens-loader'} />}>
						<div className={`lang-${this.state.lang}`} data-language={this.state.lang}>
							{window.connectedUser && window.connectedUser.isSuperAdmin && !hideAdminButtons && (
								<MenuSuperAdminFixed />
							)}
							<DisplayNavbar />
							<DisplayLanguageSelection setLanguage={(lang: ILang) => this.setState({lang})} />
							<div className={'app-wrapper'}>
								<PagesSubNavbarWrapper>
									<Switch>{this.routes.map((route) => route)}</Switch>
								</PagesSubNavbarWrapper>
							</div>
							<DisplayFooter />
						</div>
					</Suspense>
				</Router>
			</ErrorBoundary>
		);
	}

	componentDidMount() {
		hideLoader('index');
		const overlayScrollPaddingDiv = document.querySelector('.os-padding') as HTMLDivElement;
		if (overlayScrollPaddingDiv) {
			window.$(window).on('shown.bs.modal', function () {
				overlayScrollPaddingDiv.style.position = 'unset';
			});
			window.$(window).on('hidden.bs.modal', function () {
				overlayScrollPaddingDiv.style.position = 'absolute';
			});
		}
	}
}

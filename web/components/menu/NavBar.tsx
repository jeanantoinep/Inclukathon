import * as React from 'react';
import {Component} from 'react';
import './NavBar.scss';
import {getIsMobile} from '../../index';
import {withRouter} from 'react-router-dom';
import Page from '../../pages/Page';
import {PublicMenuNavBar} from './menuInstances/PublicMenuNavBar';
import {InProgressInclukathonNavBar} from './menuInstances/InProgressInclukathonNavBar';
import {inclusionConseilPath, servicesPath} from '../../routes/publicRoutes';
import {LoggedUserDto} from '../../../server/src/user/dto/logged.user.dto';
import {overlayScrollBodyInstance} from '../../App';

interface NavBarState {
	isMobileNavbar: boolean | null | undefined;
	activeUrlHash: string | null | undefined;
}

interface IProps extends IRouterProps {
	isInclusionConseilWebsite: boolean;
}

class Navbar extends Component<IProps, NavBarState> {
	constructor(props) {
		super(props);
		const isMobileNavbar = getIsMobile();

		this.state = {
			isMobileNavbar: isMobileNavbar,
			activeUrlHash: this.props.location.search,
		};
	}

	public static updateNavbarShadowClass = () => {
		const navbar = document.querySelector('.navbar');
		if (navbar) {
			if (overlayScrollBodyInstance.scroll().position.y < 40) {
				navbar.classList.remove('bottom-shadow');
			} else if (!navbar.classList.contains('bottom-shadow')) {
				navbar.classList.add('bottom-shadow');
			}
		}
	};

	// in mobile parent link dont dropdown but redirect directly
	addMobileLinks() {
		const servicesDom = document.getElementById('services-menu-link');
		if (servicesDom) {
			servicesDom.onclick = this.state.isMobileNavbar ? () => this.goTo(servicesPath) : null;
		}
		const agencyDom = document.getElementById('agency-menu-link');
		if (agencyDom) {
			agencyDom.onclick = this.state.isMobileNavbar ? () => this.goTo(inclusionConseilPath) : null;
		}
	}

	hideBurgerNavbar = () => {
		window.$('.navbar-collapse').collapse('hide');
	};

	goTo = (href: string, hash?: string) => {
		const search = Page.scrollToParamName + hash;
		const currentPathname = this.props.location.pathname;
		this.hideBurgerNavbar();
		if (currentPathname === href && hash) {
			Page.scrollToSection(search);
			this.updateActiveUrlHash(search);
			return;
		}
		if (!hash) {
			this.props.history.push(href);
			return;
		}
		this.props.history.push(href + search);
	};

	updateActiveUrlHash = (newValue: string) => {
		if (newValue != this.state.activeUrlHash) {
			this.setState({
				activeUrlHash: newValue,
			});
		}
	};

	render(): JSX.Element {
		const {isMobileNavbar, activeUrlHash} = this.state;
		const {location} = this.props;
		const user: LoggedUserDto = window.connectedUser;
		if (user?.currentInclukathon) {
			return (
				<InProgressInclukathonNavBar
					goTo={this.goTo}
					pathname={location.pathname}
					isMobileNavbar={isMobileNavbar}
					currentHash={activeUrlHash}
					currentInclukathon={window.connectedUser?.currentInclukathon}
				/>
			);
		}
		return (
			<PublicMenuNavBar
				goTo={this.goTo}
				pathname={location.pathname}
				isMobileNavbar={isMobileNavbar}
				currentHash={activeUrlHash}
			/>
		);
	}

	componentDidUpdate(prevProps) {
		this.addMobileLinks();
		if (this.props.location.pathname !== prevProps.location.pathname) {
			Page.scrollToSection(this.props.location.search);
			this.updateActiveUrlHash(this.props.location.search);
		}
	}

	componentDidMount() {
		this.addMobileLinks();
		// this.addCssClassShadow();
		Page.scrollToSection(this.state.activeUrlHash);
		window.onresize = () => {
			const resizedIsMobileNavbar = getIsMobile();
			this.setState({
				isMobileNavbar: resizedIsMobileNavbar,
			});
		};
	}
}

export default withRouter(Navbar);

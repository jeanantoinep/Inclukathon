import {Component} from 'react';
import {LogoNavBar} from '../navBarLogo/LogoNavBar';
import {PhoneBurgerBtn} from '../navbarMainBtn/PhoneBurgerBtn';
import {CommonDropdown} from '../CommonDropdown';
import {ClickableLinkNavBar} from '../ClickableLinkNavBar';
import * as React from 'react';
import {ConnexionBtnNavBar} from '../navbarMainBtn/ConnexionBtnNavBar';
import {contactPath, inclusionConseilPath, servicesPath} from '../../../routes/publicRoutes';

// hash
const hashPageExpertise = 'page-expertise';
const hashPagePlatform = 'page-platform';
const hashPageIncluscore = 'page-incluscore';
const hashPageCommunication = 'page-communication';
const hashPageAgency = 'page-inclusion-conseil-content';
const hashPageHowWeAre = 'page-how-we-are';
const hashPageValues = 'page-values';

interface IProps {
	pathname: string;
	currentHash: string;
	goTo: (url: string, hash?: string) => void;
	isMobileNavbar: boolean;
}

export class PublicMenuNavBar extends Component<IProps, any> {
	burgerMenuId = 'navbar-menu-not-logged-kth';

	render(): JSX.Element {
		const {pathname, goTo, isMobileNavbar, currentHash} = this.props;
		const isMobileHomePage = isMobileNavbar && pathname === '/';
		return (
			<>
				<nav className="public-navbar custom-navbar navbar navbar-expand-lg navbar-light">
					<LogoNavBar goTo={goTo} />
					<PhoneBurgerBtn id={this.burgerMenuId} />
					<div className="collapse navbar-collapse" id={this.burgerMenuId}>
						<ul className="navbar-nav">
							<CommonDropdown
								linkId={'services-menu-link'}
								goTo={goTo}
								isMobileNavbar={isMobileNavbar}
								dropdownLabel={'Prestation'}
								mobileDropdownLabel={'Nos prestations'}
								isActiveDropdown={pathname.includes(servicesPath) || isMobileHomePage}
								url={servicesPath}
								hashes={[
									{
										hash: hashPageExpertise,
										isActive: false, // default hash
										linkId: 'expertise',
										label: 'Expertise',
									},
									{
										hash: hashPagePlatform,
										isActive: currentHash.includes(hashPagePlatform),
										linkId: 'plateforme',
										label: 'Plateforme',
									},
									{
										hash: hashPageIncluscore,
										isActive: currentHash.includes(hashPageIncluscore),
										linkId: 'incluscore',
										label: 'IncluScore',
									},
									{
										hash: hashPageCommunication,
										isActive: currentHash.includes(hashPageCommunication),
										linkId: 'communication',
										label: 'Communication',
									},
								]}
							/>
							<CommonDropdown
								linkId={'agency-menu-link'}
								goTo={goTo}
								isMobileNavbar={isMobileNavbar}
								dropdownLabel={"L'agence"}
								mobileDropdownLabel={"L'agence Inclusion Conseil"}
								isActiveDropdown={pathname.includes(inclusionConseilPath)}
								url={inclusionConseilPath}
								hashes={[
									{
										hash: hashPageAgency,
										isActive: false, // default hash
										linkId: 'inclusion-conseil',
										label: 'Inclusion conseil',
									},
									{
										hash: hashPageHowWeAre,
										isActive: currentHash.includes(hashPageHowWeAre),
										linkId: 'how-we-are',
										label: 'Qui sommes-nous',
									},
									{
										hash: hashPageValues,
										isActive: currentHash.includes(hashPageValues),
										linkId: 'values',
										label: 'Nos valeurs',
									},
								]}
							/>
							<ClickableLinkNavBar
								goTo={goTo}
								url={contactPath}
								isActive={pathname.includes(contactPath)}
								linkId={'contact'}
								label={'Contact'}
							/>
						</ul>
						<ConnexionBtnNavBar goTo={goTo} />
					</div>
				</nav>
			</>
		);
	}
}

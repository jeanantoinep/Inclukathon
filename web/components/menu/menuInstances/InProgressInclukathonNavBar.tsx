import {Component} from 'react';
import {LogoNavBar} from '../navBarLogo/LogoNavBar';
import {PhoneBurgerBtn} from '../navbarMainBtn/PhoneBurgerBtn';
import {ClickableLinkNavBar} from '../ClickableLinkNavBar';
import * as React from 'react';
import {ConnexionBtnNavBar} from '../navbarMainBtn/ConnexionBtnNavBar';
import {
	baiKthPath,
	challengeKthPath,
	incluscoresOfKthPath,
	notationTeamListPath,
	trombinoscopeKthPath,
} from '../../../routes/inProgressInclukathonAppRoutes';
import {InclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/inclukathon.dto';
import {LoggedUserDto} from '../../../../server/src/user/dto/logged.user.dto';

interface IProps {
	pathname: string;
	currentHash: string;
	goTo: (url: string, hash?: string) => void;
	isMobileNavbar: boolean;
	currentInclukathon: InclukathonDto;
}

export class InProgressInclukathonNavBar extends Component<IProps, any> {
	burgerMenuId = 'navbar-menu-in-progress-kth';

	user: LoggedUserDto = window.connectedUser;

	render(): JSX.Element {
		const {pathname, goTo} = this.props;
		const isJuryOrManagerOrCompanyAdmin =
			this.user?.juryOfTeams?.length > 0 || this.user?.manageTeams?.length > 0 || this.user?.isCompanyAdmin;
		return (
			<nav className="inclukathon-navbar custom-navbar navbar navbar-expand-lg navbar-light">
				<LogoNavBar goTo={goTo} showInProgressKthCompanyImg={true} logoUrl={challengeKthPath} />
				<PhoneBurgerBtn id={this.burgerMenuId} />
				<div className="collapse navbar-collapse" id={this.burgerMenuId}>
					<ul className="navbar-nav">
						<ClickableLinkNavBar
							goTo={goTo}
							url={challengeKthPath}
							isActive={pathname.includes(challengeKthPath)}
							linkId={'challenge-kth'}
							label={'Le challenge'}
						/>
						<ClickableLinkNavBar
							goTo={goTo}
							url={trombinoscopeKthPath}
							isActive={pathname.includes(trombinoscopeKthPath)}
							linkId={'trombinoscope-kth'}
							label={'Les participants'}
						/>
						<ClickableLinkNavBar
							goTo={goTo}
							url={baiKthPath}
							isActive={pathname.includes(baiKthPath)}
							linkId={'bai-kth'}
							label={'IDEA'}
						/>
						{/*{this.props.currentInclukathon?.bai.length > 0 && (
							<CommonDropdown
								linkId={'IDEA'}
								goTo={goTo}
								isMobileNavbar={this.props.isMobileNavbar}
								dropdownLabel={'IDEA'}
								mobileDropdownLabel={'IDEA'}
								isActiveDropdown={pathname.includes(baiKthPath)}
								url={baiKthPath}
								hashes={this.props.currentInclukathon?.bai.map((singleBai) => ({
									fullUrl: singleBaiKthPath + '/' + singleBai.id,
									isActive: pathname.includes(singleBai.id),
									linkId: singleBai.id,
									label: singleBai.name,
								}))}
							/>
						)}*/}

						<ClickableLinkNavBar
							goTo={goTo}
							url={incluscoresOfKthPath}
							isActive={pathname.includes(incluscoresOfKthPath)}
							linkId={'incluscores-of-kth'}
							label={'IncluScore'}
						/>
						{isJuryOrManagerOrCompanyAdmin && (
							<ClickableLinkNavBar
								goTo={goTo}
								url={notationTeamListPath}
								isActive={pathname.includes(notationTeamListPath)}
								linkId={'notation-team-list'}
								label={'Notation'}
							/>
						)}
					</ul>
					<ConnexionBtnNavBar goTo={goTo} />
				</div>
			</nav>
		);
	}
}

import {Component} from 'react';
import * as React from 'react';
import {LoggedUserDto} from '../../../../server/src/user/dto/logged.user.dto';

interface IProps {
	goTo: (url: string, hash?: string) => void;
	showInProgressKthCompanyImg?: boolean;
	companyImgProvided?: string;
	logoUrl?: string;
}

export class LogoNavBar extends Component<IProps, any> {
	connectedUser: LoggedUserDto = window.connectedUser;

	showNavbarLogoWithUserCompanyImg = () => {
		const companyUrl = this.props.companyImgProvided || this.connectedUser?.company?.imgPath;
		const redirectionUrl = this.props.logoUrl || '/';
		return (
			<div
				className="navbar-brand d-flex align-items-center pointer"
				onClick={() => this.props.goTo(redirectionUrl)}
			>
				<img draggable={false} width="60" height="40" src={'/img/logo-mobile.png'} alt={'brand-logo'} />
				<img draggable={false} width="60" height="60" src={'/img/feat-company.svg'} alt={'brand-logo'} />
				<img draggable={false} width="60" height="60" src={`/company-logo/${companyUrl}`} alt={'brand-logo'} />
			</div>
		);
	};

	render() {
		if (this.props.companyImgProvided || this.props.showInProgressKthCompanyImg) {
			return this.showNavbarLogoWithUserCompanyImg();
		}
		return (
			<a className="navbar-brand" href="/">
				<img
					draggable={false}
					width="354"
					height="60"
					src={'/img/logo.png'}
					alt={'brand-logo'}
					className={'nav-logo'}
				/>
				<img
					draggable={false}
					width="195"
					height="33"
					src={'/img/logo.png'}
					alt={'brand-logo'}
					className={'nav-logo medium'}
				/>
				<img
					draggable={false}
					width="60"
					height="40"
					src={'/img/logo-mobile.png'}
					alt={'brand-logo'}
					className={'nav-logo mobile'}
				/>
			</a>
		);
	}
}

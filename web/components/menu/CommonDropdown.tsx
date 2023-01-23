import {Component} from 'react';
import {ClickableLinkNavBar} from './ClickableLinkNavBar';
import * as React from 'react';

interface HashLinkData {
	hash?: string; // if undefined, you must provide a fullUrl
	isActive: boolean;
	linkId: string;
	label: string;
	fullUrl?: string | undefined;
}

interface IProps {
	goTo: (url: string, hash?: string) => void;
	linkId: string;
	isActiveDropdown: boolean;
	isMobileNavbar: boolean;
	dropdownLabel: string;
	mobileDropdownLabel?: string;
	url: string;
	hashes: HashLinkData[];
}

export class CommonDropdown extends Component<IProps, any> {
	render() {
		const noHashSelected = !this.props.hashes.find((h) => h.isActive);
		return (
			<li className="nav-item dropdown">
				<a
					className={`nav-link dropdown-toggle ${this.props.isActiveDropdown && 'active'}`}
					id={this.props.linkId}
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
				>
					{this.props.isMobileNavbar ? this.props.mobileDropdownLabel : this.props.dropdownLabel}
				</a>
				<div className="dropdown-menu" aria-labelledby={this.props.linkId}>
					{this.props.hashes.map((hash, index) => (
						<ClickableLinkNavBar
							key={hash.hash + hash.linkId}
							goTo={this.props.goTo}
							url={hash.fullUrl ? hash.fullUrl : this.props.url}
							hash={hash.hash}
							isActive={hash.isActive || (this.props.isActiveDropdown && noHashSelected && index === 0)}
							isDropdownItem={true}
							isFullUrlDropdownItem={hash.fullUrl != null}
							linkId={hash.linkId}
							label={hash.label}
						/>
					))}
				</div>
			</li>
		);
	}
}

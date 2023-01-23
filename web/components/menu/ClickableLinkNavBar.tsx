import {Component} from 'react';
import * as React from 'react';

interface IProps {
	isActive: boolean;
	url: string;
	hash?: string;
	label: string;
	goTo: (url: string, hash?: string) => void;
	linkId: string;
	isDropdownItem?: boolean;
	isFullUrlDropdownItem?: boolean;
}

export class ClickableLinkNavBar extends Component<IProps, any> {
	tabLinkId = 'tab-' + this.props.linkId;

	renderDropdownItem = () => {
		return (
			<a
				id={this.tabLinkId}
				className={`dropdown-item ${this.props.isActive && 'active'}`}
				onClick={() =>
					this.props.isFullUrlDropdownItem
						? this.props.goTo(this.props.url)
						: this.props.goTo(this.props.url, this.props.hash)
				}
			>
				{this.props.label}
			</a>
		);
	};

	render() {
		if (this.props.isDropdownItem) {
			return this.renderDropdownItem();
		}
		return (
			<li className="nav-item">
				<a
					id={this.tabLinkId}
					className={`nav-link ${this.props.isActive && 'active'}`}
					href={'#'}
					onClick={() => this.props.goTo(this.props.url)}
				>
					{this.props.label}
				</a>
			</li>
		);
	}
}

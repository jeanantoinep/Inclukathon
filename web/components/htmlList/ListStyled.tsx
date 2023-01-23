import * as React from 'react';
import {Component} from 'react';
import {faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {
	faInstagramSquare,
	faLinkedin,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(faEnvelope, faPhone, faInstagramSquare, faLinkedin, faYoutube);

import './ListStyled.scss';

interface Link {
	text: string;
	hideInMobile?: boolean;
	hideInDesktop?: boolean;
}

interface ListStyledInterface {
	links: Link[];
}

export default class ListStyled extends Component<ListStyledInterface, any> {
	constructor(props) {
		super(props);
	}

	render(): JSX.Element {
		return (
			<div className={'list-common'}>
				<ul>
					{this.props.links.map((link, index) => {
						let extraClass = '';
						if (link.hideInDesktop) {
							extraClass += 'mobile-only';
						} else if (link.hideInMobile) {
							extraClass += 'desktop-only';
						}
						return (
							<li key={index} className={extraClass}>
								{' '}
								{link.text}{' '}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

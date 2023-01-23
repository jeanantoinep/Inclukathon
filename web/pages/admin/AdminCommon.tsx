import * as React from 'react';
import {Component} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import './AdminCommon.scss';

library.add(faArrowLeft);

interface AdminCommonProps extends IRouterProps {
	backUrl?: string;
	children?: any;
}

class AdminCommon<P extends AdminCommonProps, S> extends Component<AdminCommonProps, any> {
	constructor(props: P, state: S) {
		super(props);
		console.debug(state);
		this.checkRoles();
	}

	checkRoles() {
		if (!window.connectedUser?.isSuperAdmin) {
			window.location.href = '/';
		}
	}

	render() {
		return (
			<div className={'admin-common-component mb-5'}>
				{this.props.backUrl && (
					<button
						className={'admin-go-back-btn mt-2 btn btn-default btn-new d-print-none'}
						onClick={() => this.props.history.push(this.props.backUrl)}
					>
						<FontAwesomeIcon icon={['fas', 'arrow-left']} /> Retour
					</button>
				)}
				{this.props.children}
			</div>
		);
	}
}

export default withRouter(AdminCommon);

import {Component} from 'react';
import {companyAdminPath, inclukathonAdminPath, incluscoreAdminPath, webinarAdminPath} from '../../routes/adminRoutes';
import * as React from 'react';

export class MenuSuperAdminFixed extends Component<any, any> {
	render() {
		return (
			<div className={'menu-super-admin-fixed d-print-none'}>
				<div className={'clickable-admin-item'} onClick={() => (window.location.href = companyAdminPath)}>
					<p>Entreprises</p>
				</div>
				<div className={'clickable-admin-item'} onClick={() => (window.location.href = incluscoreAdminPath)}>
					<p>Incluscores</p>
				</div>
			</div>
		);
	}
}

import {Component} from 'react';
import * as React from 'react';
import {loginPath} from '../../../routes/publicRoutes';
import {accountPath} from '../../../routes/inProgressInclukathonAppRoutes';
import {TrombiHelper} from '../../trombiComponents/TrombiHelper';
import {LoggedUserDto} from '../../../../server/src/user/dto/logged.user.dto';
import {UserDto} from '../../../../server/src/user/dto/user.dto';

interface IProps {
	goTo: (url: string, hash?: string) => void;
}

export class ConnexionBtnNavBar extends Component<IProps, any> {
	render() {
		const user: LoggedUserDto = window.connectedUser;
		return (
			<form className="form-inline my-2 my-lg-0" action={loginPath}>
				{!user && (
					<button className="btn btn-outline-success my-2 my-sm-0 btn-all-colors" type="submit">
						{'Connexion'}
					</button>
				)}
				{user && (
					<div className={'m-auto'} style={{maxWidth: '70px'}} onClick={() => this.props.goTo(accountPath)}>
						{TrombiHelper.showUserImg(user as UserDto, false, true)}
					</div>
				)}
			</form>
		);
	}
}

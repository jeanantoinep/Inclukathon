import * as React from 'react';
import {UserDto} from '../../../server/src/user/dto/user.dto';
import './TrombiHelper.scss';
import {LoggedUserDto} from '../../../server/src/user/dto/logged.user.dto';

export class TrombiHelper {
	public static showUsersListAsTrombi(users: UserDto[], setUserModalAndOpen: (u: UserDto) => void) {
		return (
			<>
				{users?.map((u, i) => (
					<div className={'mr-3 pointer'} key={i} onClick={() => setUserModalAndOpen(u)}>
						<div className={'m-auto'} style={{maxWidth: '200px'}}>
							{TrombiHelper.showUserImg(u)}
						</div>
						<p className={'mt-3 align-center text-bold'} key={u.id}>
							{' '}
							{u.firstName + ' ' + u.lastName}
						</p>
					</div>
				))}
			</>
		);
	}

	public static showUserPresentationVideo(user: UserDto) {
		if (!user || !user.presentationVideoPath) {
			return TrombiHelper.showUserImg(user);
		}
		return (
			<div className={'user-video-presentation'}>
				<video
					style={{maxWidth: '100%'}}
					controls
					src={'/users-presentation-video/' + user.presentationVideoPath}
				/>
			</div>
		);
	}

	public static showUserImg(user: LoggedUserDto | UserDto, showBlurEffect = true, cursorPointer = false) {
		const urlPictureAvatar = user?.avatarImgPath ? '/users-avatar/' + user?.avatarImgPath : '/img/avatar.svg';
		const isJury = user?.juryOfTeams?.length > 0;
		const isManager = user?.manageTeams?.length > 0;
		const isCompanyAdmin = user?.isCompanyAdmin;
		return (
			<img
				className={`u-ktn-avatar
					${isJury && 'u-is-jury'}
					${isManager && 'u-is-manager'}
					${isCompanyAdmin && 'u-is-company-admin'}
					${showBlurEffect && 'show-blur-effect'}
					${cursorPointer && 'pointer'}
				`}
				draggable={false}
				alt={'avatar-account'}
				src={urlPictureAvatar}
			/>
		);
	}
}

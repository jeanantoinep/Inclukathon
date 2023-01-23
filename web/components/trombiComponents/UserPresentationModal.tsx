import {Component} from 'react';
import * as React from 'react';
import {UserDto} from '../../../server/src/user/dto/user.dto';
import {TrombiHelper} from './TrombiHelper';

export class UserPresentationModal extends Component<{user: UserDto}, any> {
	public static openModal() {
		window.$('#user-modal').modal(); // open
		window.$('#user-modal').on('hide.bs.modal', () => {
			(document.querySelector('.user-video-presentation video') as HTMLVideoElement)?.pause(); // pause video on modal close
		});
	}

	render() {
		const {user} = this.props;
		return (
			<div id={'user-modal'} className="modal" tabIndex={-1} role="dialog">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content c-scr-grey-bg c-coconut">
						<div className="modal-body">
							<div className={'d-flex p-2 align-items-center justify-content-center'}>
								<div className={'m-auto'} style={{maxWidth: '70%'}}>
									{TrombiHelper.showUserPresentationVideo(user)}
								</div>
								<div className={'m-auto align-center'}>
									<p className={'c-coconut pt-5 pl-5 pr-5 text-bold'}>
										{user?.firstName} {user?.lastName}
									</p>
									<p className={'c-coconut pt-2 pl-5 pr-5'}>{user?.jobName}</p>
									<p className={'c-coconut pt-2 pl-5 pr-5 pb-5'}>{user?.squadName}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

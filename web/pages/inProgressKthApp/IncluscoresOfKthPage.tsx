import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import * as React from 'react';
import AdminCompanyTeamForm from '../admin/company/AdminCompanyTeamForm';
import {KthScrAssociationDto} from '../../../server/src/inclukathon-program/models/dto/kth-scr-association.dto';
import './IncluscoresOfKthPage.scss';
import {DateTimeHelper} from '../../../server/src/helper/DateTimeHelper';
import {incluscoreHomePath} from '../../routes/incluscoreAppRoutes';

export default class IncluscoresOfKthPage extends Component<InProgressKthWrapperProps, any> {
	scrList = this.props.inclukathon.kthScrAssociation;

	renderLockIcon = (kthScrLink: KthScrAssociationDto) => {
		const unavailableIncluscore = kthScrLink.locked || !kthScrLink.isInProgress;
		if (!unavailableIncluscore) {
			return null;
		}
		return <img draggable={false} className={'icon-lock'} src={'/img/incluscore-app/lock.svg'} alt={'lock'} />;
	};

	renderDatesPreview = (kthScrLink: KthScrAssociationDto) => {
		if (kthScrLink.isInProgress) {
			return <p className={'duration-explanation'}>Termine dans {kthScrLink.durationUntilEnd}</p>;
		}
		if (kthScrLink.durationUntilStart) {
			return <p className={'duration-explanation'}>Commence dans {kthScrLink.durationUntilStart}</p>;
		}
		return (
			<p className={'duration-explanation'}>
				Terminé depuis le {DateTimeHelper.formatWithDateOnly(kthScrLink.endDate)}
			</p>
		);
	};

	private renderSingleScr(kthScrLink: KthScrAssociationDto) {
		const incluscore = kthScrLink.incluscore;
		const launchIncluscore = kthScrLink.launchIncluscore;
		const unavailableIncluscore = kthScrLink.locked || !kthScrLink.isInProgress;
		return (
			<div
				className={`common-kth-square single-scr-square ${unavailableIncluscore ? '' : 'pointer'}`}
				key={incluscore.id}
				onClick={() => {
					if (!unavailableIncluscore) {
						return window.open(window.origin + incluscoreHomePath + `?i=${launchIncluscore?.id}`, '_blank');
					}
				}}
			>
				<div className={'empty-div-for-1-1-ratio'} />
				<div className={'sub-div-for-1-1-ratio-content'}>
					<div className={'square-content'}>
						{this.renderLockIcon(kthScrLink)}
						{this.renderDatesPreview(kthScrLink)}
						<p>{incluscore.name}</p>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div id={'src-of-kth-page'} className={'common-list-page-style'}>
				{this.scrList.map((scr) => this.renderSingleScr(scr))}
			</div>
		);
	}
}

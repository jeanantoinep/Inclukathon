import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import './DeliverablesListComponent.scss';
import {DeliveriesDto} from '../../../server/src/inclukathon-program/models/dto/deliveries.dto';
import {singleDeliveryPath} from '../../routes/inProgressInclukathonAppRoutes';
import {DateTimeHelper} from '../../../server/src/helper/DateTimeHelper';

interface IProps extends InProgressKthWrapperProps {
	idTeam: string;
}

export class DeliverablesListComponent extends Component<IProps, any> {
	inclukathon = this.props.inclukathon;

	renderLockIcon = (singleDelivery: DeliveriesDto) => {
		const unavailableIncluscore = singleDelivery.locked || !singleDelivery.isInProgress;
		if (!unavailableIncluscore) {
			return null;
		}
		return <img draggable={false} className={'icon-lock'} src={'/img/incluscore-app/lock.svg'} alt={'lock'} />;
	};

	renderDatesPreview = (singleDelivery: DeliveriesDto) => {
		if (singleDelivery.isInProgress) {
			return <p className={'duration-explanation'}>Termine dans {singleDelivery.durationUntilEnd}</p>;
		}
		if (singleDelivery.durationUntilStart) {
			return <p className={'duration-explanation'}>Commence dans {singleDelivery.durationUntilStart}</p>;
		}
		return (
			<p className={'duration-explanation'}>
				Terminé depuis le {DateTimeHelper.formatWithDateOnly(singleDelivery.endDate)}
			</p>
		);
	};

	renderSingleSquare(singleDelivery: DeliveriesDto, index: number) {
		const showAsLocked = singleDelivery.locked || !singleDelivery.isInProgress;
		return (
			<div
				onClick={() => {
					if (showAsLocked) {
						return null;
					}
					return this.props.history.push(
						`${singleDeliveryPath}/team/${this.props.idTeam}/delivery/${singleDelivery.id}/index/${index}`,
					);
				}}
				className={`delivery common-kth-square ${showAsLocked ? 'locked-delivery' : 'pointer'}`}
				key={singleDelivery.id}
			>
				<div className={'empty-div-for-1-1-ratio'} />
				<div className={'sub-div-for-1-1-ratio-content'}>
					<div className={'square-content'}>
						{this.renderLockIcon(singleDelivery)}
						{this.renderDatesPreview(singleDelivery)}
						<p className={`big-delivery-title m-0`}>L{index}</p>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className={'deliverables-list-component common-list-page-style'}>
				{this.inclukathon?.deliveries.map((d, i) => this.renderSingleSquare(d, i + 1))}
			</div>
		);
	}
}

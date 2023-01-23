import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import './ChallengeExplanationKthPage.scss';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

export default class ChallengeExplanationKthPage extends Component<InProgressKthWrapperProps, any> {
	renderProgram() {
		const {inclukathon} = this.props;
		return (
			<>
				<h2 className={'program-title c-strong-purple'}>Programme de l'évènement</h2>
				<div className={'d-flex'}>
					<img
						className={'img-program-kth'}
						src={'/inclukathon-program-img/' + inclukathon.programImgPath}
						alt={'program'}
					/>
					<div style={{minWidth: '33%'}}>
						<FullCalendar
							plugins={[listPlugin]}
							initialView="listWeek"
							locales={[frLocale]}
							locale={'fr'}
							firstDay={1} // monday
							events={[
								{
									title: inclukathon.name,
									start: inclukathon.startDate.toString(),
									end: inclukathon.endDate.toString(),
								},
							]}
							validRange={{
								start: inclukathon.startDate.toString(), // date la plus ancienne parmi les starts de "events"
								end: inclukathon.endDate.toString(), // date la plus récente parmi les end de "events" (ou start si end == null)
							}}
						/>
					</div>
				</div>
			</>
		);
	}

	renderExplanation() {
		const {inclukathon} = this.props;
		return (
			<>
				<h1 className={'inclukathon-name c-sweet-purple'}>{inclukathon.name}</h1>
				<h2 className={'c-sweet-purple'}>Explication du challenge</h2>
				<p>{inclukathon.explanation}</p>
			</>
		);
	}

	render() {
		return (
			<div className={'challenge-explanation-kth-page'}>
				{this.renderExplanation()}
				{this.renderProgram()}
			</div>
		);
	}
}

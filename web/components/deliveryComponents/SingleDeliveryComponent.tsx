import * as React from 'react';
import {Component} from 'react';
import {InProgressKthWrapperProps} from '../../typings/in-progress-kth-app';
import {DeliveriesDto} from '../../../server/src/inclukathon-program/models/dto/deliveries.dto';
import {FilePondInput} from '../../fileManager/FilePondInput';
import {SINGLE_DELIVERY_FILE_UPLOAD} from '../../utils/FileUploaderHelper';
import {
	DELIVERY_FILE_UPLOADS_CTRL,
	SINGLE_DELIVERY_ENDPOINT,
	TEAM_CTRL,
} from '../../../server/src/provider/routes.helper';
import '../../rSlider.scss';
import {RangeInput} from '../../basics/RangeInput';
import {TeamDto} from '../../../server/src/team/dto/team.dto';
import {NotationDeliveryDto} from '../../../server/src/inclukathon-program/models/dto/notation-delivery.dto';
import {HttpRequester} from '../../utils/HttpRequester';
import {SaveNotationDeliveryDto} from '../../../server/src/inclukathon-program/models/dto/creation/save.notation-delivery.dto';
import {TeamDeliveryDto} from '../../../server/src/inclukathon-program/models/dto/team-delivery.dto';
import {LoggedUserDto} from '../../../server/src/user/dto/logged.user.dto';

export class SingleDeliveryComponent extends Component<
	InProgressKthWrapperProps,
	{notations: NotationDeliveryDto[]; currentTeam: TeamDto}
> {
	inclukathon = this.props.inclukathon;
	user: LoggedUserDto = window.connectedUser;
	urlParams = {...this.props.match?.params};
	idTeam = this.urlParams['idTeam'];
	idDeliveryFromUrl = this.urlParams['idDelivery'];

	constructor(props) {
		super(props);
		this.state = {
			notations: this.getNotations(),
			currentTeam: this.getCurrentTeam(),
		};
	}

	getNotations = (): NotationDeliveryDto[] => {
		const notations = [];
		const teamDelivery = this.getCurrentDeliveryForThisTeam();
		if (this.currentDelivery.notation?.length > 0) {
			for (const defaultNotation of this.currentDelivery.notation) {
				console.debug('defaultNotation', defaultNotation);
				const existingNotation = teamDelivery?.notation?.find(
					(n) => n.idNotationEvaluated === defaultNotation.id,
				);
				notations.push(existingNotation ? existingNotation : defaultNotation);
			}
		}
		return notations;
	};

	getCurrentTeam = () => {
		return this.props.company.teams.find((t) => t.id === this.idTeam);
	};

	getCurrentDeliveryForThisTeam = (): TeamDeliveryDto => {
		return this.getCurrentTeam().teamDelivery.find((td) => td.delivery.id === this.idDeliveryFromUrl);
	};

	currentDelivery: DeliveriesDto | undefined = this.inclukathon?.deliveries?.find(
		(d) => d.id === this.idDeliveryFromUrl,
	);

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);
	};

	deliveryIsReadOnly = (): boolean => {
		const isInCurrentTeam = this.user.team?.id === this.idTeam;
		const readonlyConditions = !isInCurrentTeam || this.user.isCompanyAdmin || this.isJury() || this.isManager();
		return readonlyConditions != null;
	};

	handleNotationChange = async (notation: NotationDeliveryDto, selectedValue: string) => {
		const notationToSave = this.state.notations.find(
			(n) => n.id === notation.id || n.idNotationEvaluated === notation.id,
		);
		notationToSave.selectedValue = selectedValue;
		const notationSaved = await HttpRequester.postHttp(TEAM_CTRL + '/save-notation', {
			...notationToSave,
			idDelivery: this.currentDelivery.id,
			idTeam: this.getCurrentTeam().id,
		} as SaveNotationDeliveryDto);
		if (notationSaved) {
			this.setState({
				notations: [
					...this.state.notations.filter(
						(n) =>
							n.id !== notationSaved.idNotationEvaluated &&
							n.idNotationEvaluated !== notationSaved.idNotationEvaluated,
					),
					notationSaved,
				],
			});
		}
	};

	isJury = () => {
		return this.user.juryOfTeams?.find((t) => t.id === this.idTeam);
	};

	isManager = () => {
		return this.user.manageTeams?.find((t) => t.id === this.idTeam);
	};

	renderJuryNotation() {
		return (
			<div className={'jury-notation'}>
				{this.currentDelivery?.notation?.length}
				{this.currentDelivery?.notation?.map((n) => {
					const savedNotation = this.state.notations.find(
						(sn) => sn.idNotationEvaluated === n.id || sn.id === n.id,
					);
					if (!savedNotation?.idNotationEvaluated && !this.isJury()) {
						return null;
					}
					return (
						<div key={n.id} className={'mt-4'}>
							<h3>{n.question}</h3>
							<RangeInput
								id={`range-input-notation-${n.id}`}
								availableValues={n.values}
								onValueChange={(selectedValue: string) => this.handleNotationChange(n, selectedValue)}
								initialValue={savedNotation?.selectedValue ? savedNotation.selectedValue : null}
								disabled={!this.isJury()}
							/>
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		if (!this.state.currentTeam) {
			return null;
		}
		return (
			<div>
				<p>Livrable {this.urlParams['index']}</p>
				<p className={'w-100 text-center'}> {this.currentDelivery.explanation} </p>
				<div className={'d-flex'}>
					<div className={'w-100'}>
						<FilePondInput
							disabled={this.deliveryIsReadOnly()}
							id={'single-delivery-files'}
							loadImage={false}
							filesPath={this.getCurrentDeliveryForThisTeam()?.filesPath.map((path) => path)}
							idToAssignToFilename={this.idDeliveryFromUrl}
							apiUrl={SINGLE_DELIVERY_FILE_UPLOAD}
							deleteApiUrl={DELIVERY_FILE_UPLOADS_CTRL + '/' + SINGLE_DELIVERY_ENDPOINT}
							filenameSuffix={'single-delivery'}
							allowMultiple={true}
							typeOfFileExpected={'*'}
							keepOriginalFileName={true}
							extraBodyParams={[
								{
									key: 'idUser',
									value: this.user.id,
								},
								{
									key: 'idTeam',
									value: this.idTeam,
								},
								{
									key: 'idDelivery',
									value: this.idDeliveryFromUrl,
								},
							]}
						/>
					</div>
				</div>
				{this.renderJuryNotation()}
			</div>
		);
	}
}

import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {hideLoader, showLoader} from '../../../index';
import {InclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/inclukathon.dto';
import {HttpRequester} from '../../../utils/HttpRequester';
import {SaveInclukathonDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.inclukathon.dto';
import {FilePondInput} from '../../../fileManager/FilePondInput';
import {KTH_BANNER_IMG_UPLOAD, KTH_PROGRAM_IMG_UPLOAD} from '../../../utils/FileUploaderHelper';
import {
	createCompanyAdminPath,
	createInclukathonsAdminPath,
	createInclukathonsBaiAdminPath,
	createInclukathonsDeliverableTypeAdminPath,
	createInclukathonsScrAdminPath,
	inclukathonAdminPath,
} from '../../../routes/adminRoutes';
import {INCLUKATHON_CTRL} from '../../../../server/src/provider/routes.helper';
import {AlertUpdateOnlyFields} from '../../../basics/Alerts/AlertUpdateOnlyFields';
import {DateTimeHelper} from '../../../../server/src/helper/DateTimeHelper';
import {DateTime} from 'luxon';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminInclukathonsForm extends Component<IProps, InclukathonDto> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			name: '',
			explanation: '',
			bannerImgPath: '',
			programImgPath: '',
			startDate: DateTime.now(),
			endDate: DateTime.now(),
			subject: '',
			bai: [],
			kthScrAssociation: [],
			deliveries: [],
		};
	}

	handleValue = (value: string | boolean, key: string) => {
		const update = {};
		update[key] = value;
		this.setState(update);

		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleSubmit = async () => {
		const oldId = this.state.id;
		const updatedInclukathon = await HttpRequester.postHttp(INCLUKATHON_CTRL, this.state as SaveInclukathonDto);
		this.setState({...updatedInclukathon});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(`${createInclukathonsAdminPath}/${updatedInclukathon.id}`);
		}
	};

	renderForm() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()} key={this.state.id}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Gestion d'un inclukathon </h1>
					</div>
					{!this.state.id && <AlertUpdateOnlyFields />}
					<BasicInput
						inputName={'startDate'}
						label={'Début'}
						value={this.state.startDate}
						type="datepicker"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'endDate'}
						label={'Fin (jour exclus)'}
						value={this.state.endDate}
						type="datepicker"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'name'}
						label={'Nom'}
						value={this.state.name}
						type="text"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'explanation'}
						label={'Explication'}
						value={this.state.explanation}
						type="text"
						change={this.handleValue}
					/>
					<BasicInput
						inputName={'subject'}
						label={'Sujet'}
						value={this.state.subject}
						type="text"
						change={this.handleValue}
					/>
					{this.state.id && (
						<>
							<label>Bannière</label>
							<FilePondInput
								id={'ktn-banner'}
								loadImage={false}
								filesPath={this.state.bannerImgPath ? [this.state.bannerImgPath] : []}
								idToAssignToFilename={this.state.id}
								apiUrl={KTH_BANNER_IMG_UPLOAD}
								filenameSuffix={'ktn-banner-picture'}
								keepOriginalFileName={true}
								typeOfFileExpected={'image/*'}
								extraBodyParams={[
									{
										key: 'idKth',
										value: this.state.id,
									},
								]}
							/>
							<label>Image du programme</label>
							<FilePondInput
								id={'ktn-program-img'}
								loadImage={false}
								filesPath={this.state.programImgPath ? [this.state.programImgPath] : []}
								idToAssignToFilename={this.state.id}
								apiUrl={KTH_PROGRAM_IMG_UPLOAD}
								filenameSuffix={'ktn-program-picture'}
								keepOriginalFileName={true}
								typeOfFileExpected={'image/*'}
								extraBodyParams={[
									{
										key: 'idKth',
										value: this.state.id,
									},
								]}
							/>
						</>
					)}
				</form>
				{this.state.id && (
					<>
						{this.renderBAIList()}
						{this.renderSCRList()}
						{this.renderDeliverablesTypes()}
					</>
				)}
			</>
		);
	}

	renderDeliverablesTypes() {
		const creationUrl = `${createInclukathonsDeliverableTypeAdminPath}/${this.state.id}/deliverable/`;
		return (
			<div className={'manage-inclukathon-deliverable-type-page'}>
				<div className={'d-flex justify-content-between align-items-center'}>
					<h1 className={'admin-list-titles'}>Type de livrables</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() => this.props.history.push({pathname: creationUrl})}
					>
						Nouveau type de livrable
					</button>
				</div>
				{this.state.deliveries && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Début</th>
								<th>Fin</th>
								<th>Désactivé</th>
								<th>Consigne</th>
								<th>Notations</th>
							</tr>
						</thead>
						<tbody>
							{this.state.deliveries.map((delivery, index) => {
								const editUrl = creationUrl + delivery.id;
								return (
									<tr
										key={index}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl,
											})
										}
									>
										<td>{DateTimeHelper.formatWithDateOnly(delivery.startDate)}</td>
										<td>{DateTimeHelper.formatWithDateOnly(delivery.endDate)}</td>
										<td>{delivery.locked ? 'Désactivé' : 'Activé'}</td>
										<td> {delivery.explanation} </td>
										<td>{delivery.notation?.map((n) => n.question)?.join(', ')}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}

	renderSCRList() {
		const creationUrl = `${createInclukathonsScrAdminPath}/${this.state.id}/scr/`;
		return (
			<div className={'manage-inclukathon-scr-page'}>
				<div className={'d-flex justify-content-between align-items-center'}>
					<h1 className={'admin-list-titles'}>Incluscores pendant le programme</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() => this.props.history.push({pathname: creationUrl})}
					>
						Ajouter un incluscore
					</button>
				</div>
				{this.state.kthScrAssociation && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Début</th>
								<th>Fin</th>
								<th>Nom de l'incluscore</th>
								<th>Désactivé</th>
							</tr>
						</thead>
						<tbody>
							{this.state.kthScrAssociation.map((scr, index) => {
								const editUrl = creationUrl + scr.id;
								return (
									<tr
										key={index}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl,
											})
										}
									>
										<td>{DateTimeHelper.formatWithDateOnly(scr.startDate)}</td>
										<td>{DateTimeHelper.formatWithDateOnly(scr.endDate)}</td>
										<td>{scr.incluscore?.name}</td>
										<td>{scr.locked ? 'Désactivé' : 'Activé'}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}

	renderBAIList() {
		const creationUrl = `${createInclukathonsBaiAdminPath}/${this.state.id}/bai/`;
		return (
			<div className={'manage-inclukathon-bai-page'}>
				<div className={'d-flex justify-content-between align-items-center'}>
					<h1 className={'admin-list-titles'}>Boîte à idée</h1>
					<button
						className={'btn btn-success btn-new'}
						onClick={() => this.props.history.push({pathname: creationUrl})}
					>
						Nouvelle Boîte a idée
					</button>
				</div>
				{this.state.bai && (
					<table className={'admin-table'}>
						<thead>
							<tr>
								<th>Nom</th>
								<th>Rubrique</th>
								<th>Couverture</th>
								<th>Fichiers</th>
							</tr>
						</thead>
						<tbody>
							{this.state.bai.map((bai, index) => {
								const editUrl = creationUrl + bai.id;
								return (
									<tr
										key={index}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl,
											})
										}
									>
										<td>{bai.name}</td>
										<td>{bai.rubrique}</td>
										<td>
											<img
												src={'/bai-cover/' + bai.imgCoverPath}
												alt={'couverture'}
												className={'d-block m-auto'}
												width={'100px'}
											/>
										</td>
										<td>{bai.filesPath.length} fichiers</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		);
	}

	render() {
		return this.renderForm();
	}

	async componentDidMount() {
		const id = this.props.match.params.id;
		if (id) {
			const inclukathon = await HttpRequester.getHttp(`${INCLUKATHON_CTRL}/${id}`);
			this.setState({...inclukathon});
		}
	}
}

export default withRouter(AdminInclukathonsForm);

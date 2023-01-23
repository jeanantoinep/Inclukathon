import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {HttpRequester} from '../../../utils/HttpRequester';
import {DeliveriesDto} from '../../../../server/src/inclukathon-program/models/dto/deliveries.dto';
import {SaveDeliveriesDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.deliveries.dto';
import {createInclukathonsDeliverableTypeAdminPath, createNotationDeliveryAdminPath} from '../../../routes/adminRoutes';
import {INCLUKATHON_CTRL} from '../../../../server/src/provider/routes.helper';
import {NotationDeliveryDto} from '../../../../server/src/inclukathon-program/models/dto/notation-delivery.dto';
import {DateTime} from 'luxon';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminDeliveryTypeForm extends Component<IProps, DeliveriesDto> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			explanation: '',
			startDate: DateTime.now(),
			endDate: DateTime.now(),
			locked: false,
			notation: [],
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
		const idKth = this.props.match.params.idInclukathon;
		const oldId = this.state.id;
		const delivery: DeliveriesDto = await HttpRequester.postHttp(INCLUKATHON_CTRL + '/delivery', {
			...this.state,
			idKth,
		} as SaveDeliveriesDto);
		this.setState({...delivery});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createInclukathonsDeliverableTypeAdminPath}/${idKth}/deliverable/${delivery.id}`,
			);
		}
	};

	renderNotation() {
		const editUrl =
			createNotationDeliveryAdminPath +
			`/${this.props.match.params.idInclukathon}/deliverable/${this.state.id}/notation/`;
		return (
			<div className={'manage-notation-page'}>
				<div>
					<button
						className={'d-block btn btn-success btn-new ml-auto mr-0'}
						onClick={() =>
							this.props.history.push({
								pathname: editUrl,
							})
						}
					>
						Nouvelle notation
					</button>
				</div>
				<table className={'admin-table'}>
					<thead>
						<tr>
							<th>Question</th>
							<th>Valeurs possibles</th>
						</tr>
					</thead>
					<tbody>
						{this.state.notation &&
							this.state.notation.length > 0 &&
							this.state.notation.map((notation: NotationDeliveryDto) => {
								return (
									<tr
										key={notation.id}
										className={''}
										onClick={() =>
											this.props.history.push({
												pathname: editUrl + notation.id,
											})
										}
									>
										<td>{notation.question ? notation.question : ''}</td>
										<td>{notation.values?.length > 0 ? notation.values.join(', ') : ''}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		);
	}

	renderForm() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()} key={this.state.id}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Type de livrable </h1>
					</div>

					<BasicInput
						inputName={'explanation'}
						label={'Consigne'}
						value={this.state.explanation}
						type="text"
						change={this.handleValue}
					/>

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
						inputName={'locked'}
						label={'Désactivé'}
						value={this.state.locked}
						type={'checkbox'}
						change={this.handleValue}
					/>
				</form>
			</>
		);
	}

	render() {
		return (
			<div className={'admin-deliverable-type-form'}>
				<div className={'delivery-form'}>{this.renderForm()}</div>
				<div className={'notation-list mt-5'}>{this.renderNotation()}</div>
			</div>
		);
	}

	async componentDidMount() {
		const {idDeliverable} = this.props.match.params;
		if (idDeliverable) {
			const delivery = await HttpRequester.getHttp(`${INCLUKATHON_CTRL}/delivery/${idDeliverable}`);
			this.setState({...delivery});
		}
	}
}

export default withRouter(AdminDeliveryTypeForm);

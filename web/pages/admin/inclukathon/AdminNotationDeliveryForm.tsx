import * as React from 'react';
import {Component} from 'react';
import {withRouter} from 'react-router-dom';
import BasicInput from '../../../basics/BasicInput';
import {hideLoader, showLoader} from '../../../index';
import {HttpRequester} from '../../../utils/HttpRequester';
import {
	createInclukathonsDeliverableTypeAdminPath,
	createNotationDeliveryAdminPath,
	inclukathonAdminPath,
} from '../../../routes/adminRoutes';
import {INCLUKATHON_CTRL} from '../../../../server/src/provider/routes.helper';
import {NotationDeliveryDto} from '../../../../server/src/inclukathon-program/models/dto/notation-delivery.dto';
import {DeliveriesDto} from '../../../../server/src/inclukathon-program/models/dto/deliveries.dto';
import {SaveNotationDeliveryDto} from '../../../../server/src/inclukathon-program/models/dto/creation/save.notation-delivery.dto';
import {RangeInput} from '../../../basics/RangeInput';
import {ToastHelper} from '../../../basics/ToastHelper';

type IProps = IRouterProps;

class AdminNotationDeliveryForm extends Component<IProps, NotationDeliveryDto> {
	readonly saveRequestTimeoutValue = 1000;
	saveRequestTimeoutHandler;

	constructor(props) {
		super(props);
		this.state = {
			id: undefined,
			question: '',
			values: [],
			selectedValue: '',
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
		const idDelivery = this.props.match.params.idDeliverable;
		const oldId = this.state.id;
		const notation = await HttpRequester.postHttp(INCLUKATHON_CTRL + '/notation', {
			...this.state,
			idKth,
			idDelivery,
		} as SaveNotationDeliveryDto);
		this.setState({...notation});
		ToastHelper.showSuccessMessage();
		if (!oldId) {
			// rewrite url
			return this.props.history.push(
				`${createNotationDeliveryAdminPath}/${idKth}/deliverable/${idDelivery}/notation/${notation.id}`,
			);
		}
	};

	handleNewValue = () => {
		const availableValues = this.state.values;
		this.setState({values: [...availableValues, '']});
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleNotationValueChange = (value: string, index: number) => {
		if (this.state.values?.length < 1) {
			this.setState({values: [value]});
		}
		const availableValues = this.state.values;
		availableValues[index] = value;
		this.setState({values: availableValues});
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	handleDeleteValue = (index: number) => {
		const availableValues = [];
		for (let i = 0; i < this.state.values.length; i++) {
			if (i === index) continue;
			availableValues.push(this.state.values[i]);
		}
		this.setState({values: availableValues});
		if (this.saveRequestTimeoutHandler) {
			clearTimeout(this.saveRequestTimeoutHandler);
		}
		this.saveRequestTimeoutHandler = setTimeout(() => this.handleSubmit(), this.saveRequestTimeoutValue);
	};

	renderNotations() {
		let availableValues = this.state.values;
		if (availableValues?.length < 1) {
			availableValues = [''];
		}
		return (
			<div className={'available-notations'}>
				{availableValues.map((value, index) => (
					<div key={index} className={'d-flex justify-content-between align-items-center'}>
						<div className={'w-100'}>
							<BasicInput
								value={value}
								label={'Valeur ' + (index + 1)}
								inputName={`value-${index}`}
								type={'text'}
								change={(value: string) => this.handleNotationValueChange(value, index)}
							/>
						</div>
						<button className={'btn btn-danger'} onClick={() => this.handleDeleteValue(index)}>
							Supprimer
						</button>
					</div>
				))}
			</div>
		);
	}

	renderForm() {
		return (
			<>
				<form onSubmit={(e) => e.preventDefault()} key={this.state.id}>
					<div className={'d-flex justify-content-between align-items-center mt-5'}>
						<h1> Notation </h1>
					</div>

					<BasicInput
						inputName={'question'}
						label={'Question'}
						value={this.state.question}
						type="text"
						change={this.handleValue}
					/>

					<button onClick={this.handleNewValue} className="btn btn-default">
						Ajouter une valeur
					</button>

					{this.renderNotations()}
				</form>
			</>
		);
	}

	renderNotationPreview() {
		return (
			<RangeInput
				key={this.state.values.join(',')}
				id={`notation-${this.state.id}`}
				availableValues={this.state.values}
				initialValue={null}
				onValueChange={() => console.debug('preview value change')}
			/>
		);
	}

	render() {
		return (
			<div className={'admin-notation-deliverable-form'}>
				{this.renderForm()}
				{this.renderNotationPreview()}
			</div>
		);
	}

	async componentDidMount() {
		const {idDeliverable, idNotation} = this.props.match.params;
		if (idDeliverable) {
			const delivery: DeliveriesDto = await HttpRequester.getHttp(
				`${INCLUKATHON_CTRL}/delivery/${idDeliverable}`,
			);
			let notation = {};
			if (idNotation) {
				notation = delivery.notation.find((n) => n.id === idNotation);
			}
			this.setState({...notation});
		}
	}
}

export default withRouter(AdminNotationDeliveryForm);
